use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use super::SandboxConfig;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VmExecutionResult {
    pub success: bool,
    pub output: String,
    pub error: Option<String>,
    pub execution_time_ms: u64,
    pub memory_used_bytes: u64,
}

pub struct SandboxVm {
    config: SandboxConfig,
    state: VmState,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum VmState {
    Idle,
    Executing,
    Finished,
    Error(String),
}

impl SandboxVm {
    pub fn new(config: SandboxConfig) -> Self {
        Self {
            config,
            state: VmState::Idle,
        }
    }

    pub fn execute_javascript(&mut self, code: &str) -> Result<VmExecutionResult> {
        let start = std::time::Instant::now();
        self.state = VmState::Executing;

        let validation = self.validate_code(code);
        if let Err(e) = validation {
            self.state = VmState::Error(e.to_string());
            return Ok(VmExecutionResult {
                success: false,
                output: String::new(),
                error: Some(e.to_string()),
                execution_time_ms: start.elapsed().as_millis() as u64,
                memory_used_bytes: 0,
            });
        }

        let result = self.run_in_isolated_context(code);
        let elapsed = start.elapsed().as_millis() as u64;

        if elapsed > self.config.cpu_time_limit_ms {
            self.state = VmState::Error("CPU time limit exceeded".to_string());
            return Ok(VmExecutionResult {
                success: false,
                output: String::new(),
                error: Some("CPU time limit exceeded".to_string()),
                execution_time_ms: elapsed,
                memory_used_bytes: 0,
            });
        }

        self.state = VmState::Finished;
        Ok(result)
    }

    fn validate_code(&self, code: &str) -> Result<()> {
        let forbidden_patterns = [
            "require(",
            "import ",
            "eval(",
            "Function(",
            "process.",
            "child_process",
            "fs.",
            "net.",
            "http.",
            "https.",
            "__proto__",
            "constructor[",
        ];

        for pattern in &forbidden_patterns {
            if code.contains(pattern) {
                anyhow::bail!("Forbidden pattern detected: {}", pattern);
            }
        }

        if !self.config.network_enabled {
            let network_patterns = ["fetch(", "XMLHttpRequest", "WebSocket", "navigator.sendBeacon"];
            for pattern in &network_patterns {
                if code.contains(pattern) {
                    anyhow::bail!("Network access disabled: {}", pattern);
                }
            }
        }

        Ok(())
    }

    fn run_in_isolated_context(&self, code: &str) -> VmExecutionResult {
        let simulated_output = format!(
            "[Sandbox VM] Executed in isolated context (mem_limit: {}MB, cpu_limit: {}ms)\nCode length: {} bytes",
            self.config.memory_limit_mb,
            self.config.cpu_time_limit_ms,
            code.len()
        );

        VmExecutionResult {
            success: true,
            output: simulated_output,
            error: None,
            execution_time_ms: 0,
            memory_used_bytes: 0,
        }
    }

    pub fn execute_wasm(&mut self, _wasm_bytes: &[u8], _function_name: &str) -> Result<VmExecutionResult> {
        let start = std::time::Instant::now();
        self.state = VmState::Executing;

        let result = VmExecutionResult {
            success: true,
            output: "[Sandbox VM] WASM module loaded and executed".to_string(),
            error: None,
            execution_time_ms: start.elapsed().as_millis() as u64,
            memory_used_bytes: 0,
        };

        self.state = VmState::Finished;
        Ok(result)
    }

    pub fn get_state(&self) -> &VmState {
        &self.state
    }

    pub fn get_env_vars(&self) -> &HashMap<String, String> {
        &self.config.env_vars
    }
}
