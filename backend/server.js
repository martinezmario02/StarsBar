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

// Get restaurant info:
app.get('/api/restaurants/:id', (req, res) => {
  const restaurantId = req.params.id;
  connection.query('SELECT * FROM restaurants WHERE id = ?', [restaurantId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      res.json(results[0]); // Devuelve el primer resultado encontrado
    } else {
      res.status(404).json({ error: 'Restaurante no encontrado' }); // Error si no se encuentra el restaurante
    }
  });
});

// Get reviews:
app.get('/api/restaurants/:id/reviews', (req, res) => {
  const restaurantId = req.params.id;
  connection.query(
    'SELECT r.id, r.rating, r.comment, u.name, r.created_at FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.rest_id = ? order by created_at desc', 
    [restaurantId], 
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Add review:
app.post('/api/restaurants/:id/reviews', (req, res) => {
  const restaurantId = req.params.id;
  const { rating, comment, user_id } = req.body;
  if (!rating || !comment || !user_id || !restaurantId) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  const query = 'INSERT INTO reviews (user_id, rest_id, rating, comment) VALUES (?, ?, ?, ?)';
  connection.query(query, [user_id, restaurantId, rating, comment], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Valoración añadida correctamente' });
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
          res.json({ success: true, name: user.name, id: user.id });
        } else {
          res.json({ success: false });
        }
      });
    } else {
      res.json({ success: false });
    }
  });
});

// Register user:
app.post('/api/register', async (req, res) => {
  const { name, lastName, location, mail, password } = req.body;
  if (!name || !lastName || !location || !mail || !password) {
    return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
  }

  try {
    const checkQuery = "SELECT * FROM users WHERE mail = ?";
    connection.query(checkQuery, [mail], async (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error en el servidor." });
      }

      if (results.length > 0) {
        return res.status(400).json({ success: false, message: "El correo ya está registrado." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const query = "INSERT INTO users (name, lastname, location, mail, pass, rol) VALUES (?, ?, ?, ?, ?, 'user')";
      connection.query(query, [name, lastName, location, mail, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }

        res.status(201).json({ success: true, message: 'Usuario registrado correctamente' });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al procesar el registro." });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
