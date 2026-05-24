use crate::modules::registry::ModuleRegistry;
use serde_json::json;
use std::sync::Mutex;
use sysinfo::System;
use tauri::State;

pub struct SystemState {
    pub module_registry: ModuleRegistry,
}

impl Default for SystemState {
    fn default() -> Self {
        Self {
            module_registry: ModuleRegistry::new(),
        }
    }
}

#[tauri::command]
pub fn get_system_info() -> Result<serde_json::Value, String> {
    let mut sys = System::new_all();
    sys.refresh_all();

    Ok(json!({
        "os": System::name().unwrap_or_else(|| "Unknown".to_string()),
        "kernel": System::kernel_version().unwrap_or_else(|| "Unknown".to_string()),
        "host": System::host_name().unwrap_or_else(|| "Unknown".to_string()),
        "cpu_count": sys.cpus().len(),
        "total_memory_mb": sys.total_memory() / 1024 / 1024,
        "available_memory_mb": sys.available_memory() / 1024 / 1024,
        "uptime_secs": System::uptime(),
    }))
}

#[tauri::command]
pub fn get_module_registry(
    state: State<'_, Mutex<SystemState>>,
) -> Result<serde_json::Value, String> {
    let sys_state = state.lock().map_err(|e| e.to_string())?;
    let modules = sys_state.module_registry.list();
    Ok(serde_json::to_value(modules).unwrap_or_default())
}

#[tauri::command]
pub fn load_module(
    state: State<'_, Mutex<SystemState>>,
    module_id: String,
) -> Result<serde_json::Value, String> {
    let sys_state = state.lock().map_err(|e| e.to_string())?;
    let info = sys_state.module_registry.load(&module_id)?;
    Ok(serde_json::to_value(info).unwrap_or_default())
}

#[tauri::command]
pub fn unload_module(
    state: State<'_, Mutex<SystemState>>,
    module_id: String,
) -> Result<serde_json::Value, String> {
    let sys_state = state.lock().map_err(|e| e.to_string())?;
    sys_state.module_registry.unload(&module_id)?;
    Ok(json!({"success": true, "module_id": module_id}))
}
