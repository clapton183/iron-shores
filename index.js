const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./db.sqlite');
db.run(`CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  motar TEXT,
  date TEXT,
  total REAL
)`);

app.post('/api/transaction', (req, res) => {
  const { motar, total } = req.body;
  const date = new Date().toISOString();
  db.run(`INSERT INTO transactions (motar, date, total) VALUES (?, ?, ?)`,
    [motar, date, total],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    });
});

app.get('/api/historico', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM transacoes ORDER BY data DESC');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar histórico.' });
  }
});

app.listen(PORT, () => {
  console.log('Servidor a correr na porta ' + PORT);
});
