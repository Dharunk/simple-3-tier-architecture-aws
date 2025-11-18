require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from App Tier' });
});

app.get('/db', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });
    const [rows] = await conn.query('SELECT NOW() AS now');
    await conn.end();
    res.json({ ok: true, now: rows[0].now });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('App listening on', PORT));
