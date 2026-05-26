use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResourceUsage {
    pub memory_used_bytes: u64,
    pub memory_limit_bytes: u64,
    pub cpu_time_ms: u64,
    pub cpu_limit_ms: u64,
    pub file_operations: u64,
    pub file_size_total_bytes: u64,
    pub file_size_limit_bytes: u64,
}

impl Default for ResourceUsage {
    fn default() -> Self {
        Self {
            memory_used_bytes: 0,
            memory_limit_bytes: 256 * 1024 * 1024,
            cpu_time_ms: 0,
            cpu_limit_ms: 5000,
            file_operations: 0,
            file_size_total_bytes: 0,
            file_size_limit_bytes: 1024 * 1024,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResourceLimit {
    pub resource_type: ResourceType,
    pub limit: u64,
    pub current: u64,
    pub enforced: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ResourceType {
    Memory,
    CpuTime,
    FileSize,
    FileOperations,
    NetworkBandwidth,
}

pub struct ResourceManager {
    limits: Vec<ResourceLimit>,
}

impl ResourceManager {
    pub fn new(memory_limit_mb: u64, cpu_limit_ms: u64, file_size_limit_kb: u64) -> Self {
        Self {
            limits: vec![
                ResourceLimit {
                    resource_type: ResourceType::Memory,
                    limit: memory_limit_mb * 1024 * 1024,
                    current: 0,
                    enforced: true,
                },
                ResourceLimit {
                    resource_type: ResourceType::CpuTime,
                    limit: cpu_limit_ms,
                    current: 0,
                    enforced: true,
                },
                ResourceLimit {
                    resource_type: ResourceType::FileSize,
                    limit: file_size_limit_kb * 1024,
                    current: 0,
                    enforced: true,
                },
                ResourceLimit {
                    resource_type: ResourceType::FileOperations,
                    limit: 1000,
                    current: 0,
                    enforced: true,
                },
                ResourceLimit {
                    resource_type: ResourceType::NetworkBandwidth,
                    limit: 0,
                    current: 0,
                    enforced: true,
                },
            ],
        }
    }

    pub fn check_limit(&self, resource_type: &ResourceType, additional: u64) -> ResourceCheckResult {
        for limit in &self.limits {
            if &limit.resource_type == resource_type {
                if !limit.enforced {
                    return ResourceCheckResult::Allowed;
                }
                if limit.current + additional <= limit.limit {
                    return ResourceCheckResult::Allowed;
                }
                return ResourceCheckResult::Exceeded {
                    current: limit.current,
                    limit: limit.limit,
                    requested: additional,
                };
            }
        }
        ResourceCheckResult::UnknownResource
    }

    pub fn consume(&mut self, resource_type: &ResourceType, amount: u64) -> bool {
        for limit in &mut self.limits {
            if &limit.resource_type == resource_type {
                if limit.enforced && limit.current + amount > limit.limit {
                    return false;
                }
                limit.current += amount;
                return true;
            }
        }
        false
    }

    pub fn get_usage(&self) -> ResourceUsage {
        let mem = self.limits.iter().find(|l| l.resource_type == ResourceType::Memory);
        let cpu = self.limits.iter().find(|l| l.resource_type == ResourceType::CpuTime);
        let fs = self.limits.iter().find(|l| l.resource_type == ResourceType::FileSize);
        let fops = self.limits.iter().find(|l| l.resource_type == ResourceType::FileOperations);

        ResourceUsage {
            memory_used_bytes: mem.map(|l| l.current).unwrap_or(0),
            memory_limit_bytes: mem.map(|l| l.limit).unwrap_or(0),
            cpu_time_ms: cpu.map(|l| l.current).unwrap_or(0),
            cpu_limit_ms: cpu.map(|l| l.limit).unwrap_or(0),
            file_size_total_bytes: fs.map(|l| l.current).unwrap_or(0),
            file_size_limit_bytes: fs.map(|l| l.limit).unwrap_or(0),
            file_operations: fops.map(|l| l.current).unwrap_or(0),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ResourceCheckResult {
    Allowed,
    Exceeded { current: u64, limit: u64, requested: u64 },
    UnknownResource,
}
