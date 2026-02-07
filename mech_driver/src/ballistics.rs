use nalgebra::{Vector3, Quaternion, Rotation3};
use std::f64::consts::PI;

#[derive(Debug, Clone, Copy)]
pub struct Projectile {
    mass_kg: f64,
    drag_coefficient: f64,
    muzzle_velocity_mps: f64,
    caliber_mm: f64,
}

pub struct TargetingSolution {
    pub pitch: f64,
    pub yaw: f64,
    pub flight_time_s: f64,
    pub impact_velocity: f64,
}

pub struct BallisticComputer {
    wind_vector: Vector3<f64>,
    coriolis_effect: bool,
    gravity: f64,
}

impl BallisticComputer {
    pub fn new() -> Self {
        Self {
            wind_vector: Vector3::new(2.5, 0.0, -1.2), // m/s
            coriolis_effect: true,
            gravity: 9.80665,
        }
    }

    pub fn calculate_solution(
        &self, 
        origin: Vector3<f64>, 
        target: Vector3<f64>, 
        ammo: Projectile
    ) -> Option<TargetingSolution> {
        
        let distance = (target - origin).norm();
        
        // Simplified ballistic arc calculation
        // v^2 * sin(2*theta) / g = distance
        // theta = 0.5 * asin(g * d / v^2)
        
        let v_sq = ammo.muzzle_velocity_mps.powi(2);
        let check = (self.gravity * distance) / v_sq;
        
        if check > 1.0 {
            // Target out of range
            return None; 
        }

        let angle_rad = 0.5 * check.asin();
        
        // Apply windage correction
        let wind_drift = self.wind_vector.x * (distance / ammo.muzzle_velocity_mps);
        
        Some(TargetingSolution {
            pitch: angle_rad * (180.0 / PI),
            yaw: wind_drift * 0.05,
            flight_time_s: distance / (ammo.muzzle_velocity_mps * angle_rad.cos()),
            impact_velocity: ammo.muzzle_velocity_mps * 0.85, // Velocity loss due to drag
        })
    }

    pub fn predict_intercept(&self, target_pos: Vector3<f64>, target_velocity: Vector3<f64>) -> Vector3<f64> {
        // Linear extrapolation for moving targets
        let lead_time = 1.2; // seconds
        target_pos + (target_velocity * lead_time)
    }
}
