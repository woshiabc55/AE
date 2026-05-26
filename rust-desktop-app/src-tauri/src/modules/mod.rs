pub mod plugin;
pub mod registry;

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModuleManifest {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: String,
    pub author: String,
    pub dependencies: Vec<String>,
    pub permissions: Vec<String>,
    pub entry_point: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ModuleState {
    Loaded,
    Unloaded,
    Error(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModuleInfo {
    pub manifest: ModuleManifest,
    pub state: ModuleState,
    pub loaded_at: Option<String>,
}

pub trait Module: Send + Sync {
    fn id(&self) -> &str;
    fn name(&self) -> &str;
    fn version(&self) -> &str;
    fn initialize(&mut self, config: &HashMap<String, serde_json::Value>) -> Result<(), String>;
    fn execute(&self, action: &str, params: &serde_json::Value) -> Result<serde_json::Value, String>;
    fn shutdown(&mut self) -> Result<(), String>;
}
