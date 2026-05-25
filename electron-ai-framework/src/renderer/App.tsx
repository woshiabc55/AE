import React, { useState, useEffect, useCallback } from "react";

type PanelType = "training" | "plugins" | "config" | "logs";

interface ModelInfo {
  id: string;
  name: string;
  version: string;
  status: "loaded" | "unloaded" | "loading" | "error";
}

interface TrainingStatus {
  id: string;
  modelId: string;
  status: "idle" | "running" | "paused" | "completed" | "failed";
  epoch: number;
  totalEpochs: number;
  loss: number;
  accuracy: number;
}

interface PluginInfo {
  manifest: { id: string; name: string; version: string; description: string };
  state: string;
}

interface LogEntry {
  timestamp: number;
  level: string;
  message: string;
  module: string;
}

declare global {
  interface Window {
    electronAPI: {
      ai: {
        loadModel: (modelId: string) => Promise<void>;
        unloadModel: (modelId: string) => Promise<void>;
        inference: (modelId: string, input: unknown, options?: Record<string, unknown>) => Promise<unknown>;
        startTraining: (modelId: string, datasetId: string, hyperparameters: Record<string, unknown>) => Promise<string>;
        stopTraining: (trainingId: string) => Promise<void>;
        getTrainingStatus: (trainingId: string) => Promise<TrainingStatus>;
        listModels: () => Promise<ModelInfo[]>;
        getModelInfo: (modelId: string) => Promise<ModelInfo>;
      };
      plugin: {
        register: (manifest: unknown, modulePath: string) => Promise<void>;
        activate: (pluginId: string) => Promise<void>;
        deactivate: (pluginId: string) => Promise<void>;
        unregister: (pluginId: string) => Promise<void>;
        list: () => Promise<PluginInfo[]>;
        get: (pluginId: string) => Promise<unknown>;
      };
      config: {
        get: (key: string, defaultValue?: unknown) => Promise<unknown>;
        set: (key: string, value: unknown, layer?: string) => Promise<{ success: boolean }>;
        getAll: () => Promise<Record<string, unknown>>;
        validate: () => Promise<{ valid: boolean; errors: Array<{ key: string; message: string }> }>;
        save: (layerName: string) => Promise<void>;
        reload: () => Promise<void>;
      };
      module: {
        list: () => Promise<Array<{ id: string; name: string; version: string; state: string }>>;
        load: (moduleId: string) => Promise<unknown>;
        unload: (moduleId: string) => Promise<void>;
        state: (moduleId: string) => Promise<string | null>;
      };
      system: {
        onEvent: (channel: string, callback: (...args: unknown[]) => void) => () => void;
        getPlatform: () => string;
        getVersion: () => string;
      };
    };
  }
}

const SIDEBAR_ITEMS: Array<{ key: PanelType; label: string; icon: string }> = [
  { key: "training", label: "AI 训练", icon: "🧠" },
  { key: "plugins", label: "插件管理", icon: "🧩" },
  { key: "config", label: "配置", icon: "⚙️" },
  { key: "logs", label: "日志", icon: "📋" },
];

function Sidebar({
  activePanel,
  onPanelChange,
}: {
  activePanel: PanelType;
  onPanelChange: (panel: PanelType) => void;
}): React.ReactElement {
  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <span style={styles.sidebarTitle}>AI Framework</span>
      </div>
      <nav style={styles.sidebarNav}>
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.key}
            style={{
              ...styles.sidebarItem,
              ...(activePanel === item.key ? styles.sidebarItemActive : {}),
            }}
            onClick={() => onPanelChange(item.key)}
          >
            <span style={styles.sidebarIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={styles.sidebarFooter}>
        <span style={styles.versionText}>v1.0.0</span>
      </div>
    </div>
  );
}

function TrainingPanel(): React.ReactElement {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [trainingStatuses, setTrainingStatuses] = useState<Map<string, TrainingStatus>>(new Map());
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [datasetId, setDatasetId] = useState<string>("");
  const [epochs, setEpochs] = useState<number>(10);
  const [learningRate, setLearningRate] = useState<number>(0.001);
  const [batchSize, setBatchSize] = useState<number>(32);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshModels = useCallback(async () => {
    try {
      const modelList = await window.electronAPI.ai.listModels();
      setModels(modelList);
    } catch {
      setModels([]);
    }
  }, []);

  useEffect(() => {
    refreshModels();
  }, [refreshModels]);

  const handleLoadModel = async (modelId: string): Promise<void> => {
    setLoading(true);
    try {
      await window.electronAPI.ai.loadModel(modelId);
      await refreshModels();
    } catch (err) {
      console.error("Failed to load model:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnloadModel = async (modelId: string): Promise<void> => {
    setLoading(true);
    try {
      await window.electronAPI.ai.unloadModel(modelId);
      await refreshModels();
    } catch (err) {
      console.error("Failed to unload model:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTraining = async (): Promise<void> => {
    if (!selectedModel || !datasetId) return;
    setLoading(true);
    try {
      const trainingId = await window.electronAPI.ai.startTraining(
        selectedModel,
        datasetId,
        { epochs, learningRate, batchSize }
      );
      const status = await window.electronAPI.ai.getTrainingStatus(trainingId);
      setTrainingStatuses((prev) => {
        const next = new Map(prev);
        next.set(trainingId, status);
        return next;
      });
    } catch (err) {
      console.error("Failed to start training:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStopTraining = async (trainingId: string): Promise<void> => {
    try {
      await window.electronAPI.ai.stopTraining(trainingId);
      const status = await window.electronAPI.ai.getTrainingStatus(trainingId);
      setTrainingStatuses((prev) => {
        const next = new Map(prev);
        next.set(trainingId, status);
        return next;
      });
    } catch (err) {
      console.error("Failed to stop training:", err);
    }
  };

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>AI 训练面板</h2>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>模型列表</h3>
        {models.length === 0 ? (
          <p style={styles.emptyText}>暂无已注册模型</p>
        ) : (
          <div style={styles.modelList}>
            {models.map((model) => (
              <div key={model.id} style={styles.modelCard}>
                <div style={styles.modelInfo}>
                  <strong>{model.name}</strong>
                  <span style={styles.modelVersion}>v{model.version}</span>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(model.status === "loaded"
                        ? styles.statusLoaded
                        : model.status === "error"
                          ? styles.statusError
                          : styles.statusUnloaded),
                    }}
                  >
                    {model.status}
                  </span>
                </div>
                <div style={styles.modelActions}>
                  {model.status === "loaded" ? (
                    <button
                      style={styles.buttonSmall}
                      onClick={() => handleUnloadModel(model.id)}
                      disabled={loading}
                    >
                      卸载
                    </button>
                  ) : (
                    <button
                      style={styles.buttonSmall}
                      onClick={() => handleLoadModel(model.id)}
                      disabled={loading}
                    >
                      加载
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>启动训练</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>模型 ID</label>
          <input
            style={styles.input}
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            placeholder="输入模型 ID"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>数据集 ID</label>
          <input
            style={styles.input}
            value={datasetId}
            onChange={(e) => setDatasetId(e.target.value)}
            placeholder="输入数据集 ID"
          />
        </div>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Epochs</label>
            <input
              style={styles.input}
              type="number"
              value={epochs}
              onChange={(e) => setEpochs(Number(e.target.value))}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>学习率</label>
            <input
              style={styles.input}
              type="number"
              step="0.001"
              value={learningRate}
              onChange={(e) => setLearningRate(Number(e.target.value))}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>批大小</label>
            <input
              style={styles.input}
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
            />
          </div>
        </div>
        <button
          style={{ ...styles.button, ...styles.buttonPrimary }}
          onClick={handleStartTraining}
          disabled={loading || !selectedModel || !datasetId}
        >
          开始训练
        </button>
      </section>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>训练状态</h3>
        {trainingStatuses.size === 0 ? (
          <p style={styles.emptyText}>暂无训练任务</p>
        ) : (
          Array.from(trainingStatuses.entries()).map(([id, status]) => (
            <div key={id} style={styles.trainingCard}>
              <div style={styles.trainingHeader}>
                <span>{status.modelId}</span>
                <span
                  style={{
                    ...styles.statusBadge,
                    ...(status.status === "running"
                      ? styles.statusLoaded
                      : status.status === "failed"
                        ? styles.statusError
                        : styles.statusUnloaded),
                  }}
                >
                  {status.status}
                </span>
              </div>
              <div style={styles.trainingProgress}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${status.totalEpochs > 0 ? (status.epoch / status.totalEpochs) * 100 : 0}%`,
                  }}
                />
              </div>
              <div style={styles.trainingMetrics}>
                <span>Epoch: {status.epoch}/{status.totalEpochs}</span>
                <span>Loss: {status.loss.toFixed(4)}</span>
                <span>Acc: {(status.accuracy * 100).toFixed(2)}%</span>
              </div>
              {status.status === "running" && (
                <button
                  style={{ ...styles.buttonSmall, ...styles.buttonDanger }}
                  onClick={() => handleStopTraining(id)}
                >
                  停止
                </button>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}

function PluginsPanel(): React.ReactElement {
  const [plugins, setPlugins] = useState<PluginInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshPlugins = useCallback(async () => {
    try {
      const pluginList = await window.electronAPI.plugin.list();
      setPlugins(pluginList);
    } catch {
      setPlugins([]);
    }
  }, []);

  useEffect(() => {
    refreshPlugins();
  }, [refreshPlugins]);

  const handleActivate = async (pluginId: string): Promise<void> => {
    setLoading(true);
    try {
      await window.electronAPI.plugin.activate(pluginId);
      await refreshPlugins();
    } catch (err) {
      console.error("Failed to activate plugin:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (pluginId: string): Promise<void> => {
    setLoading(true);
    try {
      await window.electronAPI.plugin.deactivate(pluginId);
      await refreshPlugins();
    } catch (err) {
      console.error("Failed to deactivate plugin:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (pluginId: string): Promise<void> => {
    setLoading(true);
    try {
      await window.electronAPI.plugin.unregister(pluginId);
      await refreshPlugins();
    } catch (err) {
      console.error("Failed to unregister plugin:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>插件管理</h2>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>已安装插件</h3>
          <button style={{ ...styles.button, ...styles.buttonSmall }} onClick={refreshPlugins}>
            刷新
          </button>
        </div>
        {plugins.length === 0 ? (
          <p style={styles.emptyText}>暂无已安装插件</p>
        ) : (
          <div style={styles.pluginList}>
            {plugins.map((plugin) => (
              <div key={plugin.manifest.id} style={styles.pluginCard}>
                <div style={styles.pluginInfo}>
                  <strong>{plugin.manifest.name}</strong>
                  <span style={styles.modelVersion}>v{plugin.manifest.version}</span>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(plugin.state === "activated"
                        ? styles.statusLoaded
                        : plugin.state === "error"
                          ? styles.statusError
                          : styles.statusUnloaded),
                    }}
                  >
                    {plugin.state}
                  </span>
                </div>
                <p style={styles.pluginDescription}>{plugin.manifest.description}</p>
                <div style={styles.pluginActions}>
                  {plugin.state === "activated" ? (
                    <button
                      style={styles.buttonSmall}
                      onClick={() => handleDeactivate(plugin.manifest.id)}
                      disabled={loading}
                    >
                      停用
                    </button>
                  ) : (
                    <button
                      style={{ ...styles.buttonSmall, ...styles.buttonPrimary }}
                      onClick={() => handleActivate(plugin.manifest.id)}
                      disabled={loading}
                    >
                      启用
                    </button>
                  )}
                  <button
                    style={{ ...styles.buttonSmall, ...styles.buttonDanger }}
                    onClick={() => handleUnregister(plugin.manifest.id)}
                    disabled={loading}
                  >
                    卸载
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ConfigPanel(): React.ReactElement {
  const [config, setConfig] = useState<Record<string, unknown>>({});
  const [editKey, setEditKey] = useState<string>("");
  const [editValue, setEditValue] = useState<string>("");
  const [validation, setValidation] = useState<{
    valid: boolean;
    errors: Array<{ key: string; message: string }>;
  } | null>(null);

  const refreshConfig = useCallback(async () => {
    try {
      const allConfig = await window.electronAPI.config.getAll();
      setConfig(allConfig);
    } catch {
      setConfig({});
    }
  }, []);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  const handleSetConfig = async (): Promise<void> => {
    if (!editKey) return;
    try {
      let parsedValue: unknown = editValue;
      try {
        parsedValue = JSON.parse(editValue);
      } catch {
        // keep as string
      }
      await window.electronAPI.config.set(editKey, parsedValue);
      await refreshConfig();
      setEditKey("");
      setEditValue("");
    } catch (err) {
      console.error("Failed to set config:", err);
    }
  };

  const handleValidate = async (): Promise<void> => {
    try {
      const result = await window.electronAPI.config.validate();
      setValidation(result);
    } catch (err) {
      console.error("Failed to validate config:", err);
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      await window.electronAPI.config.save("user");
    } catch (err) {
      console.error("Failed to save config:", err);
    }
  };

  const handleReload = async (): Promise<void> => {
    try {
      await window.electronAPI.config.reload();
      await refreshConfig();
    } catch (err) {
      console.error("Failed to reload config:", err);
    }
  };

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>配置管理</h2>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>配置项</h3>
          <div style={styles.buttonGroup}>
            <button style={{ ...styles.button, ...styles.buttonSmall }} onClick={handleValidate}>
              验证
            </button>
            <button style={{ ...styles.button, ...styles.buttonSmall }} onClick={handleSave}>
              保存
            </button>
            <button style={{ ...styles.button, ...styles.buttonSmall }} onClick={handleReload}>
              重载
            </button>
          </div>
        </div>

        {validation && (
          <div
            style={{
              ...styles.validationBox,
              ...(validation.valid ? styles.validationValid : styles.validationInvalid),
            }}
          >
            {validation.valid ? (
              <span>✓ 配置验证通过</span>
            ) : (
              <div>
                <span>✗ 配置验证失败：</span>
                <ul>
                  {validation.errors.map((err, i) => (
                    <li key={i}>
                      {err.key}: {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div style={styles.configList}>
          {Object.entries(config).map(([key, value]) => (
            <div key={key} style={styles.configItem}>
              <span style={styles.configKey}>{key}</span>
              <span style={styles.configValue}>{JSON.stringify(value)}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>修改配置</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>键</label>
          <input
            style={styles.input}
            value={editKey}
            onChange={(e) => setEditKey(e.target.value)}
            placeholder="配置键名"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>值 (JSON)</label>
          <input
            style={styles.input}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder='如: "value" 或 123 或 true'
          />
        </div>
        <button
          style={{ ...styles.button, ...styles.buttonPrimary }}
          onClick={handleSetConfig}
          disabled={!editKey}
        >
          设置
        </button>
      </section>
    </div>
  );
}

function LogsPanel(): React.ReactElement {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  useEffect(() => {
    const unsubscribe = window.electronAPI.system.onEvent("log:entry", (...args: unknown[]) => {
      const entry = args[0] as LogEntry;
      setLogs((prev) => [...prev.slice(-999), entry]);
    });
    return unsubscribe;
  }, []);

  const filteredLogs = logs.filter((entry) => {
    if (levelFilter !== "all" && entry.level !== levelFilter) return false;
    if (filter && !entry.message.includes(filter) && !entry.module.includes(filter)) return false;
    return true;
  });

  const levelColor = (level: string): React.CSSProperties => {
    switch (level) {
      case "error":
        return { color: "#ef4444" };
      case "warn":
        return { color: "#f59e0b" };
      case "info":
        return { color: "#3b82f6" };
      case "debug":
        return { color: "#6b7280" };
      default:
        return {};
    }
  };

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>日志查看</h2>

      <section style={styles.section}>
        <div style={styles.logControls}>
          <input
            style={styles.input}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="搜索日志..."
          />
          <select
            style={styles.select}
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="all">全部</option>
            <option value="debug">DEBUG</option>
            <option value="info">INFO</option>
            <option value="warn">WARN</option>
            <option value="error">ERROR</option>
          </select>
          <button
            style={{ ...styles.button, ...styles.buttonSmall }}
            onClick={() => setLogs([])}
          >
            清空
          </button>
        </div>

        <div style={styles.logContainer}>
          {filteredLogs.length === 0 ? (
            <p style={styles.emptyText}>暂无日志</p>
          ) : (
            filteredLogs.map((entry, index) => (
              <div key={index} style={styles.logEntry}>
                <span style={styles.logTimestamp}>
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
                <span style={{ ...styles.logLevel, ...levelColor(entry.level) }}>
                  [{entry.level.toUpperCase()}]
                </span>
                <span style={styles.logModule}>[{entry.module}]</span>
                <span style={styles.logMessage}>{entry.message}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export function App(): React.ReactElement {
  const [activePanel, setActivePanel] = useState<PanelType>("training");

  const renderPanel = (): React.ReactElement => {
    switch (activePanel) {
      case "training":
        return <TrainingPanel />;
      case "plugins":
        return <PluginsPanel />;
      case "config":
        return <ConfigPanel />;
      case "logs":
        return <LogsPanel />;
    }
  };

  return (
    <div style={styles.appContainer}>
      <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />
      <main style={styles.mainContent}>{renderPanel()}</main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
  },
  sidebar: {
    width: "220px",
    minWidth: "220px",
    backgroundColor: "#1e293b",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #334155",
  },
  sidebarHeader: {
    padding: "20px 16px",
    borderBottom: "1px solid #334155",
  },
  sidebarTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#f8fafc",
  },
  sidebarNav: {
    flex: 1,
    padding: "8px 0",
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "10px 16px",
    border: "none",
    backgroundColor: "transparent",
    color: "#94a3b8",
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s",
  },
  sidebarItemActive: {
    backgroundColor: "#334155",
    color: "#f8fafc",
  },
  sidebarIcon: {
    fontSize: "16px",
  },
  sidebarFooter: {
    padding: "12px 16px",
    borderTop: "1px solid #334155",
  },
  versionText: {
    fontSize: "12px",
    color: "#64748b",
  },
  mainContent: {
    flex: 1,
    overflow: "auto",
    padding: "24px",
  },
  panel: {
    maxWidth: "900px",
  },
  panelTitle: {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "24px",
    color: "#f8fafc",
  },
  section: {
    marginBottom: "32px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "12px",
    color: "#cbd5e1",
  },
  emptyText: {
    color: "#64748b",
    fontSize: "14px",
    fontStyle: "italic",
  },
  modelList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  modelCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#1e293b",
    borderRadius: "8px",
    border: "1px solid #334155",
  },
  modelInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  modelVersion: {
    fontSize: "12px",
    color: "#64748b",
  },
  modelActions: {
    display: "flex",
    gap: "8px",
  },
  statusBadge: {
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
  },
  statusLoaded: {
    backgroundColor: "#064e3b",
    color: "#34d399",
  },
  statusUnloaded: {
    backgroundColor: "#1e293b",
    color: "#94a3b8",
  },
  statusError: {
    backgroundColor: "#7f1d1d",
    color: "#f87171",
  },
  formGroup: {
    marginBottom: "12px",
  },
  formRow: {
    display: "flex",
    gap: "12px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    color: "#94a3b8",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "6px",
    color: "#e2e8f0",
    fontSize: "14px",
    outline: "none",
  },
  select: {
    padding: "8px 12px",
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "6px",
    color: "#e2e8f0",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#334155",
    color: "#e2e8f0",
    transition: "all 0.15s",
  },
  buttonPrimary: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
  },
  buttonDanger: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
  },
  buttonSmall: {
    padding: "4px 10px",
    fontSize: "12px",
  },
  buttonGroup: {
    display: "flex",
    gap: "8px",
  },
  trainingCard: {
    padding: "12px 16px",
    backgroundColor: "#1e293b",
    borderRadius: "8px",
    border: "1px solid #334155",
    marginBottom: "8px",
  },
  trainingHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  trainingProgress: {
    height: "4px",
    backgroundColor: "#334155",
    borderRadius: "2px",
    marginBottom: "8px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: "2px",
    transition: "width 0.3s",
  },
  trainingMetrics: {
    display: "flex",
    gap: "16px",
    fontSize: "13px",
    color: "#94a3b8",
  },
  pluginList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  pluginCard: {
    padding: "12px 16px",
    backgroundColor: "#1e293b",
    borderRadius: "8px",
    border: "1px solid #334155",
  },
  pluginInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px",
  },
  pluginDescription: {
    fontSize: "13px",
    color: "#94a3b8",
    marginBottom: "8px",
  },
  pluginActions: {
    display: "flex",
    gap: "8px",
  },
  configList: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  configItem: {
    display: "flex",
    gap: "12px",
    padding: "6px 12px",
    backgroundColor: "#1e293b",
    borderRadius: "4px",
    fontSize: "13px",
  },
  configKey: {
    color: "#3b82f6",
    minWidth: "200px",
    fontFamily: "monospace",
  },
  configValue: {
    color: "#94a3b8",
    fontFamily: "monospace",
    wordBreak: "break-all",
  },
  validationBox: {
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "12px",
    fontSize: "13px",
  },
  validationValid: {
    backgroundColor: "#064e3b",
    color: "#34d399",
    border: "1px solid #065f46",
  },
  validationInvalid: {
    backgroundColor: "#7f1d1d",
    color: "#f87171",
    border: "1px solid #991b1b",
  },
  logControls: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
  },
  logContainer: {
    maxHeight: "500px",
    overflow: "auto",
    backgroundColor: "#0f172a",
    borderRadius: "6px",
    padding: "8px",
    fontFamily: "monospace",
    fontSize: "12px",
  },
  logEntry: {
    padding: "2px 0",
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  logTimestamp: {
    color: "#475569",
  },
  logLevel: {
    fontWeight: 600,
    minWidth: "60px",
  },
  logModule: {
    color: "#8b5cf6",
  },
  logMessage: {
    color: "#cbd5e1",
  },
};
