#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod modules;
mod sandbox;

use commands::{sandbox_cmd, system_cmd};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to Rust Desktop App.", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            sandbox_cmd::create_sandbox,
            sandbox_cmd::execute_in_sandbox,
            sandbox_cmd::destroy_sandbox,
            sandbox_cmd::list_sandboxes,
            sandbox_cmd::get_sandbox_status,
            system_cmd::get_system_info,
            system_cmd::get_module_registry,
            system_cmd::load_module,
            system_cmd::unload_module,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    run();
}
