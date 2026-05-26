use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use super::{Module, ModuleInfo, ModuleManifest, ModuleState};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PluginConfig {
    pub auto_load: bool,
    pub sandbox_enabled: bool,
    pub priority: u32,
}

impl Default for PluginConfig {
    fn default() -> Self {
        Self {
            auto_load: false,
            sandbox_enabled: true,
            priority: 100,
        }
    }
}

pub struct PluginManager {
    plugins: HashMap<String, Box<dyn Module>>,
    configs: HashMap<String, PluginConfig>,
}

impl PluginManager {
    pub fn new() -> Self {
        Self {
            plugins: HashMap::new(),
            configs: HashMap::new(),
        }
    }

    pub fn register(&mut self, plugin: Box<dyn Module>, config: PluginConfig) {
        let id = plugin.id().to_string();
        self.configs.insert(id.clone(), config);
        self.plugins.insert(id, plugin);
    }

    pub fn load(&mut self, id: &str) -> Result<ModuleInfo, String> {
        let plugin = self.plugins.get_mut(id).ok_or("Plugin not found")?;
        let mut init_config = HashMap::new();
        plugin.initialize(&init_config)?;

        Ok(ModuleInfo {
            manifest: ModuleManifest {
                id: plugin.id().to_string(),
                name: plugin.name().to_string(),
                version: plugin.version().to_string(),
                description: String::new(),
                author: String::new(),
                dependencies: vec![],
                permissions: vec![],
                entry_point: String::new(),
            },
            state: ModuleState::Loaded,
            loaded_at: Some(chrono::Utc::now().to_rfc3339()),
        })
    }

    pub fn unload(&mut self, id: &str) -> Result<(), String> {
        let plugin = self.plugins.get_mut(id).ok_or("Plugin not found")?;
        plugin.shutdown()
    }

    pub fn execute(&self, id: &str, action: &str, params: &serde_json::Value) -> Result<serde_json::Value, String> {
        let plugin = self.plugins.get(id).ok_or("Plugin not found")?;
        plugin.execute(action, params)
    }

    pub fn list(&self) -> Vec<(&str, &PluginConfig)> {
        self.plugins
            .keys()
            .filter_map(|id| self.configs.get(id).map(|c| (id.as_str(), c)))
            .collect()
    }
}
