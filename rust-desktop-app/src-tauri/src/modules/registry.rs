use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use parking_lot::RwLock;

use super::{ModuleInfo, ModuleManifest, ModuleState};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegistryEntry {
    pub manifest: ModuleManifest,
    pub state: ModuleState,
    pub loaded_at: Option<String>,
}

pub struct ModuleRegistry {
    entries: RwLock<HashMap<String, RegistryEntry>>,
}

impl ModuleRegistry {
    pub fn new() -> Self {
        let mut entries = HashMap::new();

        let builtin_modules = vec![
            ModuleManifest {
                id: "core.sandbox".to_string(),
                name: "Sandbox Core".to_string(),
                version: "0.1.0".to_string(),
                description: "虚拟沙箱核心模块".to_string(),
                author: "System".to_string(),
                dependencies: vec![],
                permissions: vec!["sandbox.execute".to_string(), "sandbox.manage".to_string()],
                entry_point: "sandbox::core".to_string(),
            },
            ModuleManifest {
                id: "core.filesystem".to_string(),
                name: "Virtual Filesystem".to_string(),
                version: "0.1.0".to_string(),
                description: "虚拟文件系统模块".to_string(),
                author: "System".to_string(),
                dependencies: vec!["core.sandbox".to_string()],
                permissions: vec!["fs.read".to_string(), "fs.write".to_string()],
                entry_point: "fs::virtual_fs".to_string(),
            },
            ModuleManifest {
                id: "core.network".to_string(),
                name: "Network Proxy".to_string(),
                version: "0.1.0".to_string(),
                description: "网络代理与隔离模块".to_string(),
                author: "System".to_string(),
                dependencies: vec!["core.sandbox".to_string()],
                permissions: vec!["net.proxy".to_string(), "net.filter".to_string()],
                entry_point: "net::proxy".to_string(),
            },
            ModuleManifest {
                id: "core.process".to_string(),
                name: "Process Manager".to_string(),
                version: "0.1.0".to_string(),
                description: "进程管理与隔离模块".to_string(),
                author: "System".to_string(),
                dependencies: vec!["core.sandbox".to_string()],
                permissions: vec!["process.spawn".to_string(), "process.monitor".to_string()],
                entry_point: "process::manager".to_string(),
            },
        ];

        for manifest in builtin_modules {
            let id = manifest.id.clone();
            entries.insert(
                id,
                RegistryEntry {
                    manifest,
                    state: ModuleState::Unloaded,
                    loaded_at: None,
                },
            );
        }

        Self {
            entries: RwLock::new(entries),
        }
    }

    pub fn register(&self, manifest: ModuleManifest) -> Result<(), String> {
        let id = manifest.id.clone();
        let mut entries = self.entries.write();
        if entries.contains_key(&id) {
            return Err(format!("Module {} already registered", id));
        }
        entries.insert(
            id,
            RegistryEntry {
                manifest,
                state: ModuleState::Unloaded,
                loaded_at: None,
            },
        );
        Ok(())
    }

    pub fn load(&self, id: &str) -> Result<ModuleInfo, String> {
        let mut entries = self.entries.write();
        let entry = entries.get_mut(id).ok_or("Module not found")?;

        for dep in &entry.manifest.dependencies {
            if let Some(dep_entry) = entries.get(dep) {
                if dep_entry.state != ModuleState::Loaded {
                    return Err(format!("Dependency {} not loaded", dep));
                }
            }
        }

        entry.state = ModuleState::Loaded;
        entry.loaded_at = Some(chrono::Utc::now().to_rfc3339());

        Ok(ModuleInfo {
            manifest: entry.manifest.clone(),
            state: entry.state.clone(),
            loaded_at: entry.loaded_at.clone(),
        })
    }

    pub fn unload(&self, id: &str) -> Result<(), String> {
        let mut entries = self.entries.write();
        let entry = entries.get_mut(id).ok_or("Module not found")?;
        entry.state = ModuleState::Unloaded;
        entry.loaded_at = None;
        Ok(())
    }

    pub fn list(&self) -> Vec<ModuleInfo> {
        self.entries
            .read()
            .values()
            .map(|e| ModuleInfo {
                manifest: e.manifest.clone(),
                state: e.state.clone(),
                loaded_at: e.loaded_at.clone(),
            })
            .collect()
    }

    pub fn get(&self, id: &str) -> Option<ModuleInfo> {
        self.entries.read().get(id).map(|e| ModuleInfo {
            manifest: e.manifest.clone(),
            state: e.state.clone(),
            loaded_at: e.loaded_at.clone(),
        })
    }
}
