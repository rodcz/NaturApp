const express = require('express');
const cors = require('cors');
const { db, initializeDB } = require('./database');

const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware para registrar CADA solicitud en la consola
app.use((req, res, next) => {
  console.log(`[API] Solicitud recibida: ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Initialize SQLite DB
initializeDB();

// GET /api/products
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM products';
  const params = [];

  if (category && category !== 'todos') {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Parse JSON benefits
    const products = rows.map(r => ({
      ...r,
      benefits: r.benefits ? JSON.parse(r.benefits) : []
    }));
    res.json(products);
  });
});

// GET /api/products/search
app.get('/api/products/search', (req, res) => {
  const { q } = req.query;
  const sql = 'SELECT * FROM products WHERE name LIKE ?';
  db.all(sql, [`%${q}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const products = rows.map(r => ({
      ...r,
      benefits: r.benefits ? JSON.parse(r.benefits) : []
    }));
    res.json(products);
  });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    row.benefits = row.benefits ? JSON.parse(row.benefits) : [];
    res.json(row);
  });
});

// GET /api/categories
app.get('/api/categories', (req, res) => {
  res.json(['todos', 'superfoods', 'aceites', 'capsulas', 'infusiones', 'miel']);
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
  const { items, total, address } = req.body;
  const itemsJson = JSON.stringify(items);
  const status = 'procesando';
  const date = new Date().toISOString();

  db.run(`INSERT INTO orders (total, address, status, date, items) VALUES (?, ?, ?, ?, ?)`,
    [total, address, status, date, itemsJson],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, total, address, status, date, items });
    });
});

// GET /api/orders
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const orders = rows.map(r => ({
      ...r,
      items: r.items ? JSON.parse(r.items) : []
    }));
    res.json(orders);
  });
});

// GET /api/orders/:id
app.get('/api/orders/:id', (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    row.items = row.items ? JSON.parse(row.items) : [];
    res.json(row);
  });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Dummy authentication
  if (email && password) {
    res.json({
      token: 'fake-jwt-token-12345',
      user: { name: 'Usuario Prueba', email }
    });
  } else {
    res.status(400).json({ error: 'Email y password requeridos' });
  }
});

const PORT = 9090;
app.listen(PORT, () => {
  console.log(`Backend server running perfectly at http://localhost:${PORT}`);
  console.log(`Mobile app pointing to http://10.0.2.2:${PORT}/api will now connect!`);
});
