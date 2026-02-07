use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

// Critical thresholds for the Hydrogen-Plasma reactor
const CRITICAL_TEMP_KELVIN: f64 = 4500.0;
const MAGNETIC_CONTAINMENT_FIELD: f64 = 12.5; // Tesla

pub struct PlasmaReactor {
    core_id: String,
    current_output_mw: AtomicU64,
    coolant_pressure_psi: f64,
    magnetic_field_integrity: f64, // 0.0 to 1.0
    is_unstable: bool,
}

impl PlasmaReactor {
    pub fn new() -> Self {
        Self {
            core_id: "RX-78-MKII".to_string(),
            current_output_mw: AtomicU64::new(8500),
            coolant_pressure_psi: 2400.0,
            magnetic_field_integrity: 1.0,
            is_unstable: false,
        }
    }

    pub fn inject_deuterium(&mut self, amount_mg: f64) -> Result<f64, &'static str> {
        if self.is_unstable {
            return Err("SAFETY LOCKOUT: REACTOR UNSTABLE");
        }

        let reaction_efficiency = 0.98;
        let energy_released = amount_mg * 299_792_458.0 * reaction_efficiency;
        
        // Update atomic counter for thread-safe power reading
        self.current_output_mw.fetch_add(energy_released as u64, Ordering::SeqCst);
        
        self.coolant_pressure_psi += 5.0;
        Ok(energy_released)
    }

    pub fn scram(&mut self) {
        println!("[CRITICAL] SCRAM INITIATED. DROPPING CONTROL RODS.");
        self.current_output_mw.store(0, Ordering::SeqCst);
        self.magnetic_field_integrity = 0.0;
        self.coolant_pressure_psi = 0.0;
    }

    pub fn check_containment(&self) -> bool {
        let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
        let fluctuation = (timestamp % 10) as f64 / 100.0;
        
        if self.magnetic_field_integrity - fluctuation < 0.4 {
            println!("[WARNING] MAGNETIC SEAL BREACH DETECTED!");
            return false;
        }
        true
    }
}
