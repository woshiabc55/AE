const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'data', 'lens-standard.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id TEXT,
    description TEXT DEFAULT '',
    document_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    document_number TEXT NOT NULL UNIQUE,
    version TEXT NOT NULL DEFAULT '1.0',
    category_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    content TEXT NOT NULL DEFAULT '{}',
    created_by TEXT NOT NULL DEFAULT 'system',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS version_histories (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    version TEXT NOT NULL,
    changes TEXT NOT NULL DEFAULT '',
    changed_by TEXT NOT NULL DEFAULT 'system',
    changed_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS lens_parameters (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'optical'
  );

  CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category_id);
  CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
  CREATE INDEX IF NOT EXISTS idx_documents_updated ON documents(updated_at);
  CREATE INDEX IF NOT EXISTS idx_version_histories_document ON version_histories(document_id);
  CREATE INDEX IF NOT EXISTS idx_lens_parameters_document ON lens_parameters(document_id);
`);

const initCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get();
if (initCategories.count === 0) {
  const insertCategory = db.prepare('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)');
  const insertDoc = db.prepare("INSERT INTO documents (id, title, document_number, category_id, status, content, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)");

  const categories = [
    ['cat-1', '定焦镜头', '固定焦距镜头标准'],
    ['cat-2', '变焦镜头', '可变焦距镜头标准'],
    ['cat-3', '广角镜头', '广角类镜头标准'],
    ['cat-4', '长焦镜头', '长焦类镜头标准'],
    ['cat-5', '微距镜头', '微距类镜头标准'],
  ];

  const insertMany = db.transaction(() => {
    for (const [id, name, desc] of categories) {
      insertCategory.run(id, name, desc);
    }

    insertDoc.run('doc-1', '50mm f/1.4 定焦镜头标准', 'STD-FIX-001', 'cat-1', 'published',
      JSON.stringify({summary:'50mm标准定焦镜头性能标准',parameters:[{name:'焦距',value:'50',unit:'mm',category:'optical'},{name:'最大光圈',value:'1.4',unit:'f/',category:'optical'},{name:'MTF50中心',value:'0.85',unit:'lp/mm',category:'optical'},{name:'MTF50边缘',value:'0.62',unit:'lp/mm',category:'optical'},{name:'畸变',value:'0.3',unit:'%',category:'optical'},{name:'重量',value:'290',unit:'g',category:'mechanical'},{name:'工作温度',value:'-10~45',unit:'°C',category:'environmental'}],testConditions:[{name:'测试距离',value:'5m'},{name:'光源色温',value:'5500K'}],notes:'适用于标准定焦镜头出厂检验'}),
      'admin');

    insertDoc.run('doc-2', '24-70mm f/2.8 变焦镜头标准', 'STD-ZOOM-001', 'cat-2', 'review',
      JSON.stringify({summary:'24-70mm专业变焦镜头性能标准',parameters:[{name:'焦距范围',value:'24-70',unit:'mm',category:'optical'},{name:'最大光圈',value:'2.8',unit:'f/',category:'optical'},{name:'MTF50中心',value:'0.78',unit:'lp/mm',category:'optical'},{name:'MTF50边缘',value:'0.55',unit:'lp/mm',category:'optical'},{name:'畸变(广角端)',value:'2.1',unit:'%',category:'optical'},{name:'重量',value:'850',unit:'g',category:'mechanical'},{name:'工作温度',value:'-10~45',unit:'°C',category:'environmental'}],testConditions:[{name:'测试距离',value:'5m'},{name:'光源色温',value:'5500K'}],notes:'适用于专业变焦镜头出厂检验'}),
      'admin');

    insertDoc.run('doc-3', '14mm f/2.8 广角镜头标准', 'STD-WIDE-001', 'cat-3', 'draft',
      JSON.stringify({summary:'14mm超广角镜头性能标准',parameters:[{name:'焦距',value:'14',unit:'mm',category:'optical'},{name:'最大光圈',value:'2.8',unit:'f/',category:'optical'},{name:'视场角',value:'114',unit:'°',category:'optical'},{name:'MTF50中心',value:'0.72',unit:'lp/mm',category:'optical'},{name:'畸变',value:'3.5',unit:'%',category:'optical'},{name:'重量',value:'560',unit:'g',category:'mechanical'},{name:'工作温度',value:'-10~40',unit:'°C',category:'environmental'}],testConditions:[{name:'测试距离',value:'3m'},{name:'光源色温',value:'5500K'}],notes:'适用于超广角镜头出厂检验'}),
      'engineer');

    insertDoc.run('doc-4', '200mm f/2.8 长焦镜头标准', 'STD-TELE-001', 'cat-4', 'published',
      JSON.stringify({summary:'200mm长焦镜头性能标准',parameters:[{name:'焦距',value:'200',unit:'mm',category:'optical'},{name:'最大光圈',value:'2.8',unit:'f/',category:'optical'},{name:'MTF50中心',value:'0.82',unit:'lp/mm',category:'optical'},{name:'MTF50边缘',value:'0.68',unit:'lp/mm',category:'optical'},{name:'畸变',value:'0.2',unit:'%',category:'optical'},{name:'重量',value:'760',unit:'g',category:'mechanical'},{name:'工作温度',value:'-10~45',unit:'°C',category:'environmental'}],testConditions:[{name:'测试距离',value:'10m'},{name:'光源色温',value:'5500K'}],notes:'适用于长焦镜头出厂检验'}),
      'admin');

    insertDoc.run('doc-5', '100mm f/2.8 微距镜头标准', 'STD-MACRO-001', 'cat-5', 'draft',
      JSON.stringify({summary:'100mm微距镜头性能标准',parameters:[{name:'焦距',value:'100',unit:'mm',category:'optical'},{name:'最大光圈',value:'2.8',unit:'f/',category:'optical'},{name:'最大放大倍率',value:'1.0',unit:'x',category:'optical'},{name:'MTF50中心',value:'0.88',unit:'lp/mm',category:'optical'},{name:'畸变',value:'0.1',unit:'%',category:'optical'},{name:'重量',value:'620',unit:'g',category:'mechanical'},{name:'工作温度',value:'-10~45',unit:'°C',category:'environmental'}],testConditions:[{name:'测试距离',value:'0.3m'},{name:'光源色温',value:'5500K'}],notes:'适用于微距镜头出厂检验'}),
      'engineer');
  });

  insertMany();
}

module.exports = db;
