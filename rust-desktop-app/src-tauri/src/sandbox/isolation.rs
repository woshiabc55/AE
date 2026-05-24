use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IsolationLevel {
    pub filesystem: FsIsolation,
    pub network: NetworkIsolation,
    pub process: ProcessIsolation,
}

impl Default for IsolationLevel {
    fn default() -> Self {
        Self {
            filesystem: FsIsolation::Chroot,
            network: NetworkIsolation::Disabled,
            process: ProcessIsolation::Restricted,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum FsIsolation {
    None,
    Chroot,
    VirtualFs,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum NetworkIsolation {
    Full,
    Restricted,
    Disabled,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ProcessIsolation {
    None,
    Restricted,
    Full,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IsolationConfig {
    pub level: IsolationLevel,
    pub allowed_paths: Vec<String>,
    pub blocked_syscalls: Vec<String>,
}

impl Default for IsolationConfig {
    fn default() -> Self {
        Self {
            level: IsolationLevel::default(),
            allowed_paths: vec!["/tmp/sandbox".to_string()],
            blocked_syscalls: vec![
                "fork".to_string(),
                "execve".to_string(),
                "kill".to_string(),
                "mount".to_string(),
                "umount".to_string(),
                "chroot".to_string(),
                "ptrace".to_string(),
            ],
        }
    }
}

pub struct IsolationManager {
    config: IsolationConfig,
}

impl IsolationManager {
    pub fn new(config: IsolationConfig) -> Self {
        Self { config }
    }

    pub fn validate_path_access(&self, path: &str) -> bool {
        if matches!(self.config.level.filesystem, FsIsolation::None) {
            return true;
        }
        self.config.allowed_paths.iter().any(|allowed| path.starts_with(allowed))
    }

    pub fn is_syscall_blocked(&self, syscall: &str) -> bool {
        self.config.blocked_syscalls.contains(&syscall.to_string())
    }

    pub fn get_isolation_report(&self) -> IsolationReport {
        IsolationReport {
            fs_isolation: self.config.level.filesystem.clone(),
            network_isolation: self.config.level.network.clone(),
            process_isolation: self.config.level.process.clone(),
            allowed_paths_count: self.config.allowed_paths.len(),
            blocked_syscalls_count: self.config.blocked_syscalls.len(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IsolationReport {
    pub fs_isolation: FsIsolation,
    pub network_isolation: NetworkIsolation,
    pub process_isolation: ProcessIsolation,
    pub allowed_paths_count: usize,
    pub blocked_syscalls_count: usize,
}
