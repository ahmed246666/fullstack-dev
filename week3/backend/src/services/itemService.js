const db = require('../config/db');

const getAllItems = ({ search, status } = {}) => {
  let query = 'SELECT * FROM items WHERE 1=1';
  const params = [];

  if (search && search.trim()) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term);
  }

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY createdAt DESC';
  const stmt = db.prepare(query);
  const items = stmt.all(...params);

  // Status counts
  const totalCount = db.prepare('SELECT COUNT(*) as count FROM items').get().count;
  const pendingCount = db.prepare("SELECT COUNT(*) as count FROM items WHERE status = 'pending'").get().count;
  const inProgressCount = db.prepare("SELECT COUNT(*) as count FROM items WHERE status = 'in-progress'").get().count;
  const completedCount = db.prepare("SELECT COUNT(*) as count FROM items WHERE status = 'completed'").get().count;

  return {
    items,
    counts: {
      all: totalCount,
      pending: pendingCount,
      'in-progress': inProgressCount,
      completed: completedCount
    }
  };
};

const getItemById = (id) => {
  const stmt = db.prepare('SELECT * FROM items WHERE id = ?');
  return stmt.get(id);
};

const createItem = ({ title, description, status = 'pending' }) => {
  const stmt = db.prepare(`
    INSERT INTO items (title, description, status)
    VALUES (?, ?, ?)
  `);
  const info = stmt.run(title.trim(), description ? description.trim() : null, status);
  return getItemById(info.lastInsertRowid);
};

const updateItemStatus = (id, status) => {
  const stmt = db.prepare('UPDATE items SET status = ? WHERE id = ?');
  const info = stmt.run(status, id);
  if (info.changes === 0) return null;
  return getItemById(id);
};

const deleteItem = (id) => {
  const stmt = db.prepare('DELETE FROM items WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItemStatus,
  deleteItem
};
