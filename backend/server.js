const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const connection = require('./db');

app.use('/imgs', express.static(path.join(__dirname, 'imgs')));
app.use(cors());
app.use(express.json());

// Get restaurants:
app.get('/api/restaurants', (req, res) => {
  connection.query('SELECT * FROM restaurants', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get users:
app.get('/api/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Check login:
app.post('/api/login', (req, res) => {
  const { mail, pass } = req.body;
  connection.query('SELECT * FROM users WHERE mail = ?', [mail], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(pass, user.pass, (err, result) => {
        if (result) {
          res.json({ success: true, name: user.name });
        } else {
          res.json({ success: false });
        }
      });
    } else {
      res.json({ success: false });
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
