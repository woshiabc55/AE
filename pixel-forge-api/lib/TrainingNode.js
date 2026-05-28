const crypto = require('crypto');

class TrainingNode {
  static TYPES = {
    PREPROCESS: 'preprocess',
    ENCODE: 'encode',
    TRAIN: 'train',
    EVALUATE: 'evaluate',
    EXPORT: 'export',
    AUGMENT: 'augment',
    FILTER: 'filter',
  };

  static STATUS = {
    IDLE: 'idle',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
    PAUSED: 'paused',
  };

  constructor(id, config) {
    this.id = id || 'node_' + crypto.randomBytes(4).toString('hex');
    this.name = config.name || this.id;
    this.type = config.type || TrainingNode.TYPES.PREPROCESS;
    this.status = TrainingNode.STATUS.IDLE;
    this.config = {
      input: config.input || null,
      output: config.output || null,
      params: config.params || {},
      batchSize: config.batchSize || 32,
      epochs: config.epochs || 1,
      learningRate: config.learningRate || 0.001,
      modelArch: config.modelArch || 'pixel-cnn',
      augmentations: config.augmentations || [],
      filters: config.filters || {},
    };
    this.metrics = {
      startTime: null,
      endTime: null,
      duration: 0,
      samplesProcessed: 0,
      loss: null,
      accuracy: null,
    };
    this.logs = [];
    this.nextNodes = [];
  }

  start() {
    this.status = TrainingNode.STATUS.RUNNING;
    this.metrics.startTime = new Date().toISOString();
    this.log({ level: 'info', msg: `Node ${this.name} started (${this.type})` });
  }

  complete(metrics = {}) {
    this.status = TrainingNode.STATUS.COMPLETED;
    this.metrics.endTime = new Date().toISOString();
    this.metrics.duration = Date.now() - new Date(this.metrics.startTime).getTime();
    this.metrics.samplesProcessed = metrics.samplesProcessed || 0;
    this.metrics.loss = metrics.loss || null;
    this.metrics.accuracy = metrics.accuracy || null;
    this.log({ level: 'info', msg: `Node ${this.name} completed (${this.metrics.duration}ms, ${this.metrics.samplesProcessed} samples)` });
  }

  fail(error) {
    this.status = TrainingNode.STATUS.FAILED;
    this.metrics.endTime = new Date().toISOString();
    this.log({ level: 'error', msg: `Node ${this.name} failed: ${error}` });
  }

  pause() {
    if (this.status === TrainingNode.STATUS.RUNNING) {
      this.status = TrainingNode.STATUS.PAUSED;
      this.log({ level: 'info', msg: `Node ${this.name} paused` });
    }
  }

  log(entry) {
    this.logs.push({ timestamp: new Date().toISOString(), ...entry });
    if (this.logs.length > 500) this.logs = this.logs.slice(-200);
  }

  connect(nextNode) {
    if (!this.nextNodes.find(n => n.id === nextNode.id)) {
      this.nextNodes.push({ id: nextNode.id, name: nextNode.name, type: nextNode.type });
    }
  }

  async simulate(datasetSize = 100) {
    this.start();
    const steps = 5;
    const delay = 300 + Math.random() * 700;

    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, delay));
      const batchSize = Math.floor(datasetSize / steps);
      this.metrics.samplesProcessed += batchSize;
      this.metrics.loss = Math.max(0.01, 1.0 - (i / steps) * 0.8 + Math.random() * 0.1);
      this.metrics.accuracy = Math.min(0.99, (i / steps) * 0.7 + Math.random() * 0.1);
      this.log({ level: 'info', msg: `Step ${i + 1}/${steps} | loss: ${this.metrics.loss.toFixed(4)} | acc: ${(this.metrics.accuracy * 100).toFixed(1)}%` });
    }

    this.complete({ samplesProcessed: datasetSize, loss: this.metrics.loss, accuracy: this.metrics.accuracy });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      status: this.status,
      config: this.config,
      metrics: this.metrics,
      logs: this.logs.slice(-50),
      nextNodes: this.nextNodes,
    };
  }
}

class TrainingPipeline {
  constructor() {
    this.nodes = new Map();
    this.name = 'pipeline_' + crypto.randomBytes(3).toString('hex');
    this.status = 'idle';
    this.created = new Date().toISOString();
  }

  createNode(config) {
    const node = new TrainingNode(null, config);
    this.nodes.set(node.id, node);
    return node;
  }

  removeNode(nodeId) {
    this.nodes.delete(nodeId);
    for (const node of this.nodes.values()) {
      node.nextNodes = node.nextNodes.filter(n => n.id !== nodeId);
    }
  }

  connect(fromId, toId) {
    const from = this.nodes.get(fromId);
    const to = this.nodes.get(toId);
    if (!from || !to) return { ok: false, error: 'node not found' };
    from.connect(to);
    return { ok: true };
  }

  getNode(id) {
    return this.nodes.get(id) || null;
  }

  listNodes() {
    return [...this.nodes.values()].map(n => n.toJSON());
  }

  async run(datasetSize = 100) {
    this.status = 'running';
    const sorted = this._topologicalSort();

    for (const node of sorted) {
      await node.simulate(datasetSize);
      if (node.status === TrainingNode.STATUS.FAILED) {
        this.status = 'failed';
        return { ok: false, error: `Node ${node.name} failed` };
      }
      datasetSize = node.metrics.samplesProcessed || datasetSize;
    }

    this.status = 'completed';
    return { ok: true, nodes: sorted.length, status: this.status };
  }

  _topologicalSort() {
    const visited = new Set();
    const sorted = [];
    const nodeList = [...this.nodes.values()];

    function visit(node) {
      if (visited.has(node.id)) return;
      visited.add(node.id);
      for (const next of node.nextNodes) {
        const nextNode = nodeList.find(n => n.id === next.id);
        if (nextNode) visit(nextNode);
      }
      sorted.unshift(node);
    }

    for (const node of nodeList) {
      visit(node);
    }

    return sorted;
  }

  toJSON() {
    return {
      name: this.name,
      status: this.status,
      created: this.created,
      nodes: this.listNodes(),
    };
  }
}

module.exports = { TrainingNode, TrainingPipeline };