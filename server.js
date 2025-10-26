const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

fs.ensureDirSync(DATA_DIR);
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, '[]', 'utf8');
}

function readOrders() {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8') || '[]');
  } catch (e) {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

// API: get orders
app.get('/api/orders', (req, res) => {
  const orders = readOrders();
  // return reverse chronological
  res.json(orders.slice().reverse());
});

// API: create order
app.post('/api/order', (req, res) => {
  const { name, items, total } = req.body;
  if (!name || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }
  const orders = readOrders();
  const newOrder = {
    id: Date.now().toString(),
    name,
    items,
    total,
    time: new Date().toLocaleString('vi-VN')
  };
  orders.push(newOrder);
  writeOrders(orders);
  res.json({ success: true, orderId: newOrder.id });
});

// simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));
// Admin: delete order by id
app.delete('/api/orders/:id', (req, res) => {
  const id = req.params.id;
  const orders = readOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  orders.splice(idx, 1);
  writeOrders(orders);
  res.json({ success: true });
});

// Export CSV
app.get('/api/orders/csv', (req, res) => {
  const orders = readOrders();
  const rows = [['id','name','items_count','total','time']];
  orders.forEach(o => rows.push([o.id, o.name, o.items.length, o.total, o.time]));
  const csv = rows.map(r => r.map(v => '"' + String(v).replace(/"/g,'""') + '"').join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
  res.send(csv);
});

// fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Shop.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
