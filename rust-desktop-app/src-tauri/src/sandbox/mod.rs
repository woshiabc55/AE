pub mod isolation;
pub mod resource;
pub mod vm;

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use parking_lot::RwLock;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SandboxConfig {
    pub id: String,
    pub name: String,
    pub memory_limit_mb: u64,
    pub cpu_time_limit_ms: u64,
    pub max_file_size_kb: u64,
    pub network_enabled: bool,
    pub env_vars: HashMap<String, String>,
}

impl Default for SandboxConfig {
    fn default() -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            name: "default-sandbox".to_string(),
            memory_limit_mb: 256,
            cpu_time_limit_ms: 5000,
            max_file_size_kb: 1024,
            network_enabled: false,
            env_vars: HashMap::new(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SandboxState {
    Created,
    Running,
    Paused,
    Stopped,
    Error(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SandboxInfo {
    pub config: SandboxConfig,
    pub state: SandboxState,
    pub created_at: String,
    pub resource_usage: resource::ResourceUsage,
}

pub struct SandboxManager {
    sandboxes: Arc<RwLock<HashMap<String, SandboxInfo>>>,
}

impl SandboxManager {
    pub fn new() -> Self {
        Self {
            sandboxes: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    pub fn create(&self, config: SandboxConfig) -> Result<SandboxInfo, String> {
        let id = config.id.clone();
        let info = SandboxInfo {
            config,
            state: SandboxState::Created,
            created_at: chrono::Utc::now().to_rfc3339(),
            resource_usage: resource::ResourceUsage::default(),
        };
        self.sandboxes.write().insert(id, info.clone());
        tracing::info!("Sandbox created: {}", info.config.id);
        Ok(info)
    }

    pub fn get(&self, id: &str) -> Option<SandboxInfo> {
        self.sandboxes.read().get(id).cloned()
    }

    pub fn list(&self) -> Vec<SandboxInfo> {
        self.sandboxes.read().values().cloned().collect()
    }

    pub fn update_state(&self, id: &str, state: SandboxState) -> Result<(), String> {
        let mut sandboxes = self.sandboxes.write();
        if let Some(info) = sandboxes.get_mut(id) {
            info.state = state;
            Ok(())
        } else {
            Err(format!("Sandbox {} not found", id))
        }
    }

    pub fn destroy(&self, id: &str) -> Result<(), String> {
        let mut sandboxes = self.sandboxes.write();
        sandboxes
            .remove(id)
            .ok_or_else(|| format!("Sandbox {} not found", id))?;
        tracing::info!("Sandbox destroyed: {}", id);
        Ok(())
    }

    pub fn update_resource_usage(
        &self,
        id: &str,
        usage: resource::ResourceUsage,
    ) -> Result<(), String> {
        let mut sandboxes = self.sandboxes.write();
        if let Some(info) = sandboxes.get_mut(id) {
            info.resource_usage = usage;
            Ok(())
        } else {
            Err(format!("Sandbox {} not found", id))
        }
    }
}
