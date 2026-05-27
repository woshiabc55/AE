const fs = require('fs');
const path = require('path');
const AssetManager = require('./AssetManager');

const DRAFT_STATES = {
  DRAFT: 'draft',
  REVIEW: 'review',
  APPROVED: 'approved',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

class SelectDraft {
  constructor(senikDir) {
    this.assetMgr = new AssetManager(senikDir);
    this.draftsDir = 'drafts';
    this._ensureDir();
  }

  _ensureDir() {
    this.assetMgr.mkdir(this.draftsDir);
    this.assetMgr.mkdir(`${this.draftsDir}/pending`);
    this.assetMgr.mkdir(`${this.draftsDir}/review`);
    this.assetMgr.mkdir(`${this.draftsDir}/approved`);
    this.assetMgr.mkdir(`${this.draftsDir}/published`);
    this.assetMgr.mkdir(`${this.draftsDir}/archived`);
  }

  create(draft) {
    const id = draft.id || `draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const state = draft.state || DRAFT_STATES.DRAFT;
    const relPath = `${this.draftsDir}/${state}/${id}.json`;
    const content = JSON.stringify({
      id,
      title: draft.title || '未命名草稿',
      type: draft.type || 'general',
      state,
      tags: draft.tags || [],
      content: draft.content || {},
      meta: {
        author: draft.author || 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        history: [{ state, timestamp: new Date().toISOString(), note: 'created' }]
      }
    }, null, 2);
    return { ...this.assetMgr.write(relPath, content), id, state };
  }

  get(id) {
    for (const state of Object.values(DRAFT_STATES)) {
      const relPath = `${this.draftsDir}/${state}/${id}.json`;
      const data = this.assetMgr.read(relPath);
      if (data && data.type === 'text') {
        try { return { ...JSON.parse(data.content), _path: relPath }; } catch {}
      }
    }
    return null;
  }

  transition(id, newState, note = '') {
    const draft = this.get(id);
    if (!draft) return { ok: false, error: 'draft not found' };
    const validStates = Object.values(DRAFT_STATES);
    if (!validStates.includes(newState)) return { ok: false, error: `invalid state: ${newState}` };

    const oldPath = draft._path;
    draft.state = newState;
    draft.meta.updatedAt = new Date().toISOString();
    draft.meta.version++;
    draft.meta.history.push({ state: newState, timestamp: new Date().toISOString(), note });

    const newPath = `${this.draftsDir}/${newState}/${id}.json`;
    this.assetMgr.write(newPath, JSON.stringify(draft, null, 2));
    if (oldPath !== newPath) this.assetMgr.delete(oldPath);

    return { ok: true, id, from: oldPath, to: newPath, state: newState, version: draft.meta.version };
  }

  listByState(state) {
    const dir = `${this.draftsDir}/${state}`;
    const files = this.assetMgr.list(dir);
    return files
      .filter(f => f.type === 'file' && f.name.endsWith('.json'))
      .map(f => {
        const data = this.assetMgr.read(`${dir}/${f.name}`);
        if (data && data.type === 'text') {
          try { return JSON.parse(data.content); } catch { return null; }
        }
        return null;
      }).filter(Boolean);
  }

  listAll() {
    const result = {};
    for (const [key, state] of Object.entries(DRAFT_STATES)) {
      result[key.toLowerCase()] = this.listByState(state);
    }
    return result;
  }

  update(id, updates) {
    const draft = this.get(id);
    if (!draft) return { ok: false, error: 'draft not found' };
    const merged = { ...draft, ...updates, meta: { ...draft.meta, updatedAt: new Date().toISOString(), version: draft.meta.version + 1 } };
    delete merged._path;
    const relPath = `${this.draftsDir}/${draft.state}/${id}.json`;
    return this.assetMgr.write(relPath, JSON.stringify(merged, null, 2));
  }

  delete(id) {
    const draft = this.get(id);
    if (!draft) return { ok: false, error: 'draft not found' };
    return this.assetMgr.delete(draft._path);
  }
}

SelectDraft.STATES = DRAFT_STATES;

class DocPlanner {
  constructor(senikDir) {
    this.selectDraft = new SelectDraft(senikDir);
    this.assetMgr = new AssetManager(senikDir);
  }

  createPlan(plan) {
    return this.selectDraft.create({
      id: plan.id || `plan-${Date.now()}`,
      title: plan.title || '未命名规划',
      type: 'doc-plan',
      state: DRAFT_STATES.DRAFT,
      tags: plan.tags || ['planning'],
      content: {
        objective: plan.objective || '',
        scope: plan.scope || [],
        milestones: plan.milestones || [],
        deliverables: plan.deliverables || [],
        dependencies: plan.dependencies || [],
        timeline: plan.timeline || {},
        resources: plan.resources || {}
      },
      author: plan.author || 'system'
    });
  }

  createModuleSpec(spec) {
    return this.selectDraft.create({
      id: spec.id || `mod-${Date.now()}`,
      title: spec.title || '未命名模块规格',
      type: 'module-spec',
      state: DRAFT_STATES.DRAFT,
      tags: spec.tags || ['module', 'spec'],
      content: {
        moduleId: spec.moduleId || '',
        description: spec.description || '',
        interfaces: spec.interfaces || [],
        dependencies: spec.dependencies || [],
        exports: spec.exports || [],
        events: spec.events || [],
        params: spec.params || [],
        testCases: spec.testCases || []
      },
      author: spec.author || 'system'
    });
  }

  createEffectSpec(spec) {
    return this.selectDraft.create({
      id: spec.id || `fx-${Date.now()}`,
      title: spec.title || '未命名效果规格',
      type: 'effect-spec',
      state: DRAFT_STATES.DRAFT,
      tags: spec.tags || ['effect', 'spec'],
      content: {
        effectId: spec.effectId || '',
        name: spec.name || '',
        category: spec.category || 'custom',
        description: spec.description || '',
        algorithm: spec.algorithm || '',
        params: spec.params || [],
        inputOutput: spec.inputOutput || { input: 'ImageData', output: 'ImageData' },
        performance: spec.performance || { complexity: 'O(n)', notes: '' }
      },
      author: spec.author || 'system'
    });
  }

  getPlans() {
    const all = this.selectDraft.listAll();
    const plans = [];
    for (const drafts of Object.values(all)) {
      for (const d of drafts) {
        if (d.type === 'doc-plan') plans.push(d);
      }
    }
    return plans;
  }

  getModuleSpecs() {
    const all = this.selectDraft.listAll();
    const specs = [];
    for (const drafts of Object.values(all)) {
      for (const d of drafts) {
        if (d.type === 'module-spec') specs.push(d);
      }
    }
    return specs;
  }

  getEffectSpecs() {
    const all = this.selectDraft.listAll();
    const specs = [];
    for (const drafts of Object.values(all)) {
      for (const d of drafts) {
        if (d.type === 'effect-spec') specs.push(d);
      }
    }
    return specs;
  }

  approve(id) {
    return this.selectDraft.transition(id, DRAFT_STATES.APPROVED, 'approved by doc planner');
  }

  publish(id) {
    return this.selectDraft.transition(id, DRAFT_STATES.PUBLISHED, 'published');
  }

  archive(id) {
    return this.selectDraft.transition(id, DRAFT_STATES.ARCHIVED, 'archived');
  }

  review(id) {
    return this.selectDraft.transition(id, DRAFT_STATES.REVIEW, 'sent for review');
  }

  getStats() {
    const all = this.selectDraft.listAll();
    const stats = { total: 0, byType: {}, byState: {} };
    for (const [state, drafts] of Object.entries(all)) {
      stats.byState[state] = drafts.length;
      stats.total += drafts.length;
      for (const d of drafts) {
        stats.byType[d.type] = (stats.byType[d.type] || 0) + 1;
      }
    }
    return stats;
  }
}

DocPlanner.STATES = DRAFT_STATES;

module.exports = { DocPlanner, SelectDraft };
