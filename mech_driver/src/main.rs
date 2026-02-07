use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use std::collections::HashMap;
use tokio::time;
use serde::{Serialize, Deserialize};
use rand::Rng;
use log::{info, warn, error, debug, trace};

// --- CONSTANTS & CONFIG ---

const KERNEL_VERSION: &str = "5.19.0-mech-rt";
const HEARTBEAT_INTERVAL_MS: u64 = 50;
const MAX_SERVO_TORQUE_NM: f64 = 450.0;
const CRYPTO_SALT: &str = "X9_F4_PROTO_KEY";

// --- DATA STRUCTURES ---

#[derive(Debug, Clone, Serialize, Deserialize)]
enum SystemStatus {
    ColdBoot,
    Diagnostic,
    Operational,
    CombatLock,
    EmergencyPurge,
}

#[derive(Debug, Clone)]
struct ServoUnit {
    id: String,
    position: f64, // Radians
    velocity: f64, // Rad/s
    temperature: f64, // Celsius
    status: String,
}

impl ServoUnit {
    fn new(id: &str) -> Self {
        Self {
            id: id.to_string(),
            position: 0.0,
            velocity: 0.0,
            temperature: 35.0,
            status: "CALIBRATING".to_string(),
        }
    }

    fn update(&mut self, dt: f64) {
        let mut rng = rand::thread_rng();
        // Simulate micro-jitters in mechanical joints
        let jitter = rng.gen_range(-0.001..0.001);
        self.position += self.velocity * dt + jitter;
        
        // Heat dissipation simulation
        if self.velocity.abs() > 0.1 {
            self.temperature += 0.05 * self.velocity.abs();
        } else {
            self.temperature = self.temperature * 0.99 + 35.0 * 0.01;
        }
    }
}

struct MechKernel {
    uptime: Instant,
    status: SystemStatus,
    servos: HashMap<String, Arc<Mutex<ServoUnit>>>,
    encryption_key: String,
}

impl MechKernel {
    fn new() -> Self {
        info!("Allocating Kernel Slab Memory...");
        Self {
            uptime: Instant::now(),
            status: SystemStatus::ColdBoot,
            servos: HashMap::new(),
            encryption_key: format!("{:x}", md5::compute(CRYPTO_SALT)),
        }
    }

    async fn initialize_hardware(&mut self) {
        info!("Initializing hardware interfaces on PCI bus...");
        time::sleep(Duration::from_millis(800)).await;

        let joint_ids = vec!["L_ARM_01", "L_ARM_02", "R_ARM_01", "R_ARM_02", "L_LEG_MAIN", "R_LEG_MAIN", "TORSO_GYRO"];
        
        for id in joint_ids {
            let servo = ServoUnit::new(id);
            self.servos.insert(id.to_string(), Arc::new(Mutex::new(servo)));
            info!("[PCI:0x{:04X}] Device {} attached and mapped.", rand::thread_rng().gen_range(0..65535), id);
            time::sleep(Duration::from_millis(150)).await;
        }
        
        self.status = SystemStatus::Diagnostic;
        info!("Hardware mapping complete. {} units online.", self.servos.len());
    }

    async fn run_diagnostics(&mut self) -> bool {
        warn!("Starting Pre-Flight Diagnostic Sequence...");
        let steps = vec![
            "Checking Hydraulic Pressure...",
            "Verifying Neural Link Latency...",
            "Loading Ballistic Tables...",
            "Syncing with Neural Cortex (Python)..."
        ];

        for step in steps {
            info!("{}", step);
            time::sleep(Duration::from_millis(400)).await;
        }

        self.status = SystemStatus::Operational;
        info!("ALL SYSTEMS GREEN. REACTOR OUTPUT: 104%");
        true
    }
}

// --- SECURITY MODULE ---

fn encrypt_telemetry(data: &str) -> String {
    // Simulating high-overhead encryption
    let mut rng = rand::thread_rng();
    let noise: u32 = rng.gen();
    format!("[AES256:{:x}]>>{}", noise, data)
}

// --- MAIN EVENT LOOP ---

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Setup logging environment
    std::env::set_var("RUST_LOG", "debug");
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("debug"))
        .format_timestamp_millis()
        .init();

    info!("MechOS Kernel v{} booting...", KERNEL_VERSION);
    
    let mut kernel = MechKernel::new();
    
    // Boot Sequence
    kernel.initialize_hardware().await;
    if !kernel.run_diagnostics().await {
        error!("Diagnostic Check Failed! Halting System.");
        return Ok(());
    }

    // High-Frequency Control Loop
    info!("Engaging Main Control Loop (Tick Rate: {}ms)", HEARTBEAT_INTERVAL_MS);
    
    let mut interval = time::interval(Duration::from_millis(HEARTBEAT_INTERVAL_MS));
    let mut tick_count: u64 = 0;

    loop {
        interval.tick().await;
        tick_count += 1;

        // 1. Update Physics/Servos
        for (id, unit) in kernel.servos.iter() {
            let mut servo = unit.lock().unwrap();
            servo.update(0.05);
            
            // Random status logging
            if tick_count % 100 == 0 && rand::thread_rng().gen_bool(0.1) {
                debug!("[{}] Temp: {:.2}C | Pos: {:.4} | Drift: CORRECTED", id, servo.temperature, servo.position);
            }
        }

        // 2. Telemetry & Encryption
        if tick_count % 40 == 0 {
            let telemetry_packet = format!("TICK_{}:STATUS_{:?}", tick_count, kernel.status);
            let encrypted = encrypt_telemetry(&telemetry_packet);
            trace!("TX Uplink: {}", encrypted);
        }

        // 3. Random Event Simulation
        if tick_count % 200 == 0 {
            let event_type = rand::thread_rng().gen_range(0..3);
            match event_type {
                0 => info!("[NET] Keep-Alive packet received from Neural Cortex."),
                1 => warn!("[COOLING] Venting excess plasma from manifold B."),
                _ => debug!("[LIDAR] Sector scan complete. 0 targets found."),
            }
        }
    }
}
