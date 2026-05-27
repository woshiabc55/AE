const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/documents', (req, res) => {
  const { page = 1, pageSize = 10, categoryId, status, search, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;
  let query = 'SELECT * FROM documents WHERE 1=1';
  const params = [];

  if (categoryId) { query += ' AND category_id = ?'; params.push(categoryId); }
  if (status) { query += ' AND status = ?'; params.push(status); }
  if (search) { query += ' AND (title LIKE ? OR document_number LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
  const total = db.prepare(countQuery).get(...params).total;

  const validSorts = ['updatedAt', 'createdAt', 'title'];
  const sort = validSorts.includes(sortBy) ? sortBy.replace('updatedAt', 'updated_at').replace('createdAt', 'created_at') : 'updated_at';
  const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
  query += ` ORDER BY ${sort} ${order}`;

  const offset = (Number(page) - 1) * Number(pageSize);
  query += ' LIMIT ? OFFSET ?';
  params.push(Number(pageSize), offset);

  const documents = db.prepare(query).all(...params);
  const result = documents.map(doc => ({
    ...doc,
    categoryId: doc.category_id,
    documentNumber: doc.document_number,
    createdBy: doc.created_by,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
    content: JSON.parse(doc.content || '{}'),
  }));

  res.json({ items: result, total, page: Number(page), pageSize: Number(pageSize) });
});

app.get('/api/documents/:id', (req, res) => {
  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const parameters = db.prepare('SELECT * FROM lens_parameters WHERE document_id = ?').all(req.params.id);
  const versions = db.prepare('SELECT * FROM version_histories WHERE document_id = ? ORDER BY changed_at DESC').all(req.params.id);

  res.json({
    ...doc,
    categoryId: doc.category_id,
    documentNumber: doc.document_number,
    createdBy: doc.created_by,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
    content: JSON.parse(doc.content || '{}'),
    parameters,
    versions,
  });
});

app.post('/api/documents', (req, res) => {
  const id = uuidv4();
  const { title, documentNumber, version = '1.0', categoryId, status = 'draft', content = {}, createdBy = 'system' } = req.body;

  try {
    db.prepare('INSERT INTO documents (id, title, document_number, version, category_id, status, content, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, title, documentNumber, version, categoryId, status, JSON.stringify(content), createdBy);

    db.prepare('INSERT INTO version_histories (id, document_id, version, changes, changed_by) VALUES (?, ?, ?, ?, ?)')
      .run(uuidv4(), id, version, '初始创建', createdBy);

    const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(id);
    res.status(201).json({
      ...doc,
      categoryId: doc.category_id,
      documentNumber: doc.document_number,
      createdBy: doc.created_by,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
      content: JSON.parse(doc.content || '{}'),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/documents/:id', (req, res) => {
  const { title, documentNumber, version, categoryId, status, content, createdBy } = req.body;
  const existing = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Document not found' });

  const newVersion = version || existing.version;
  db.prepare('UPDATE documents SET title=?, document_number=?, version=?, category_id=?, status=?, content=?, updated_at=datetime(\'now\') WHERE id=?')
    .run(title || existing.title, documentNumber || existing.document_number, newVersion, categoryId || existing.category_id, status || existing.status, JSON.stringify(content || JSON.parse(existing.content)), req.params.id);

  if (status && status !== existing.status) {
    db.prepare('INSERT INTO version_histories (id, document_id, version, changes, changed_by) VALUES (?, ?, ?, ?, ?)')
      .run(uuidv4(), req.params.id, newVersion, `状态变更为: ${status}`, createdBy || 'system');
  }

  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);
  res.json({
    ...doc,
    categoryId: doc.category_id,
    documentNumber: doc.document_number,
    createdBy: doc.created_by,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
    content: JSON.parse(doc.content || '{}'),
  });
});

app.delete('/api/documents/:id', (req, res) => {
  db.prepare('DELETE FROM lens_parameters WHERE document_id = ?').run(req.params.id);
  db.prepare('DELETE FROM version_histories WHERE document_id = ?').run(req.params.id);
  db.prepare('DELETE FROM documents WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
  res.json(categories.map(c => ({
    ...c,
    parentId: c.parent_id,
    documentCount: c.document_count,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  })));
});

app.post('/api/categories', (req, res) => {
  const id = uuidv4();
  const { name, parentId, description = '' } = req.body;
  db.prepare('INSERT INTO categories (id, name, parent_id, description) VALUES (?, ?, ?, ?)').run(id, name, parentId || null, description);
  const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  res.status(201).json({ ...cat, parentId: cat.parent_id, documentCount: cat.document_count });
});

app.get('/api/documents/:id/versions', (req, res) => {
  const versions = db.prepare('SELECT * FROM version_histories WHERE document_id = ? ORDER BY changed_at DESC').all(req.params.id);
  res.json(versions.map(v => ({
    ...v,
    documentId: v.document_id,
    changedBy: v.changed_by,
    changedAt: v.changed_at,
  })));
});

app.post('/api/ai/generate', (req, res) => {
  const { prompt, templateId } = req.body;
  const generatedContent = {
    summary: `AI生成的镜头标准文档 - 基于: ${prompt}`,
    parameters: [
      { name: '焦距', value: '50', unit: 'mm', category: 'optical' },
      { name: '最大光圈', value: '1.8', unit: 'f/', category: 'optical' },
      { name: 'MTF50中心', value: '0.80', unit: 'lp/mm', category: 'optical' },
      { name: 'MTF50边缘', value: '0.58', unit: 'lp/mm', category: 'optical' },
      { name: '畸变', value: '0.5', unit: '%', category: 'optical' },
      { name: '重量', value: '350', unit: 'g', category: 'mechanical' },
      { name: '工作温度', value: '-10~45', unit: '°C', category: 'environmental' },
    ],
    testConditions: [
      { name: '测试距离', value: '5m' },
      { name: '光源色温', value: '5500K' },
    ],
    notes: `由AI根据需求"${prompt}"自动生成的标准文档草稿，请根据实际情况调整参数。`,
  };

  res.json({
    content: generatedContent,
    conversationId: uuidv4(),
    rawMarkdown: `# ${prompt}\n\n${generatedContent.summary}\n\n## 光学参数\n| 参数 | 值 | 单位 |\n|------|-----|------|\n| 焦距 | 50 | mm |\n| 最大光圈 | 1.8 | f/ |\n| MTF50中心 | 0.80 | lp/mm |\n| MTF50边缘 | 0.58 | lp/mm |\n| 畸变 | 0.5 | % |`,
  });
});

app.get('/api/ai/templates', (req, res) => {
  res.json([
    { id: 'tpl-1', name: '定焦镜头标准模板', description: '适用于定焦镜头的标准文档模板' },
    { id: 'tpl-2', name: '变焦镜头标准模板', description: '适用于变焦镜头的标准文档模板' },
    { id: 'tpl-3', name: '广角镜头标准模板', description: '适用于广角镜头的标准文档模板' },
    { id: 'tpl-4', name: '长焦镜头标准模板', description: '适用于长焦镜头的标准文档模板' },
    { id: 'tpl-5', name: '微距镜头标准模板', description: '适用于微距镜头的标准文档模板' },
  ]);
});

app.get('/api/ai/models', (req, res) => {
  res.json([
    { modelId: 'ernie-4.0', displayName: 'ERNIE 4.0' },
    { modelId: 'ernie-3.5', displayName: 'ERNIE 3.5' },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
