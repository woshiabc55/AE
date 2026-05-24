use crate::sandbox::{SandboxConfig, SandboxManager, SandboxState};
use crate::sandbox::vm::VmExecutionResult;
use crate::sandbox::resource::ResourceManager;
use std::sync::Mutex;
use tauri::State;

pub struct AppState {
    pub sandbox_manager: SandboxManager,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            sandbox_manager: SandboxManager::new(),
        }
    }
}

#[tauri::command]
pub fn create_sandbox(
    state: State<'_, Mutex<AppState>>,
    name: Option<String>,
    memory_limit_mb: Option<u64>,
    cpu_time_limit_ms: Option<u64>,
    network_enabled: Option<bool>,
) -> Result<serde_json::Value, String> {
    let app_state = state.lock().map_err(|e| e.to_string())?;
    let mut config = SandboxConfig::default();

    if let Some(n) = name {
        config.name = n;
    }
    if let Some(m) = memory_limit_mb {
        config.memory_limit_mb = m;
    }
    if let Some(c) = cpu_time_limit_ms {
        config.cpu_time_limit_ms = c;
    }
    if let Some(n) = network_enabled {
        config.network_enabled = n;
    }

    let info = app_state.sandbox_manager.create(config)?;
    Ok(serde_json::to_value(info).unwrap_or_default())
}

#[tauri::command]
pub fn execute_in_sandbox(
    state: State<'_, Mutex<AppState>>,
    sandbox_id: String,
    code: String,
    language: Option<String>,
) -> Result<serde_json::Value, String> {
    let app_state = state.lock().map_err(|e| e.to_string())?;

    let info = app_state
        .sandbox_manager
        .get(&sandbox_id)
        .ok_or("Sandbox not found")?;

    if info.state == SandboxState::Stopped {
        return Err("Sandbox is stopped".to_string());
    }

    let lang = language.unwrap_or_else(|| "javascript".to_string());

    let result = match lang.as_str() {
        "javascript" | "js" => {
            let mut vm = crate::sandbox::vm::SandboxVm::new(info.config.clone());
            let exec_result = vm.execute_javascript(&code).map_err(|e| e.to_string())?;
            exec_result
        }
        "wasm" => {
            let mut vm = crate::sandbox::vm::SandboxVm::new(info.config.clone());
            let exec_result = vm.execute_wasm(code.as_bytes(), "main").map_err(|e| e.to_string())?;
            exec_result
        }
        _ => {
            return Err(format!("Unsupported language: {}", lang));
        }
    };

    Ok(serde_json::to_value(result).unwrap_or_default())
}

#[tauri::command]
pub fn destroy_sandbox(
    state: State<'_, Mutex<AppState>>,
    sandbox_id: String,
) -> Result<serde_json::Value, String> {
    let app_state = state.lock().map_err(|e| e.to_string())?;
    app_state.sandbox_manager.destroy(&sandbox_id)?;
    Ok(serde_json::json!({"success": true, "id": sandbox_id}))
}

#[tauri::command]
pub fn list_sandboxes(
    state: State<'_, Mutex<AppState>>,
) -> Result<serde_json::Value, String> {
    let app_state = state.lock().map_err(|e| e.to_string())?;
    let list = app_state.sandbox_manager.list();
    Ok(serde_json::to_value(list).unwrap_or_default())
}

#[tauri::command]
pub fn get_sandbox_status(
    state: State<'_, Mutex<AppState>>,
    sandbox_id: String,
) -> Result<serde_json::Value, String> {
    let app_state = state.lock().map_err(|e| e.to_string())?;
    let info = app_state
        .sandbox_manager
        .get(&sandbox_id)
        .ok_or("Sandbox not found")?;
    Ok(serde_json::to_value(info).unwrap_or_default())
}
