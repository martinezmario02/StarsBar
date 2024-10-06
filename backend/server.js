const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const connection = require('./db');

// Middleware para servir archivos estáticos
app.use('/imgs', express.static(path.join(__dirname, 'imgs')));
app.use(cors());
app.use(express.json());

// Ruta para obtener los restaurantes
app.get('/api/restaurants', (req, res) => {
  connection.query('SELECT * FROM restaurants', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
