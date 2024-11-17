const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const connection = require('./db');
const logger = require('./utils/logger');


app.use('/imgs', express.static(path.join(__dirname, 'imgs')));
app.use(cors());
app.use(express.json());

// Get restaurants:
app.get('/api/restaurants', (req, res) => {
  logger.info('Petición GET a /api/restaurants recibida.');
  
  connection.query('SELECT * FROM restaurants', (err, results) => {
    if (err) {
      logger.error(`Error al consultar restaurantes: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
    logger.info('Consulta a los restaurantes realizada correctamente.');
    res.json(results);
  });
});

// Get restaurant info:
app.get('/api/restaurants/:id', (req, res) => {
  const restaurantId = req.params.id;
  logger.info(`Petición GET a /api/restaurants/${restaurantId} recibida.`);
  
  connection.query('SELECT * FROM restaurants WHERE id = ?', [restaurantId], (err, results) => {
    if (err) {
      logger.error(`Error al consultar la información del restaurante: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      logger.info('Consulta a la información del restaurante realizada correctamente.');
      res.json(results[0]); 
    } else {
      logger.error('Error al buscar el restaurante');
      res.status(404).json({ error: 'Restaurante no encontrado' }); 
    }
  });
});

// Get reviews:
app.get('/api/restaurants/:id/reviews', (req, res) => {
  const restaurantId = req.params.id;
  logger.info(`Petición GET a /api/restaurants/${restaurantId}/reviews recibida.`);
  
  connection.query(
    'SELECT r.id, r.rating, r.comment, u.name, r.created_at FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.rest_id = ? order by created_at desc', 
    [restaurantId], 
    (err, results) => {
      if (err) {
        logger.error(`Error al consultar las valoraciones del restaurante: ${err.message}`);
        return res.status(500).json({ error: err.message });
      }
      logger.info('Consulta a las valoraciones del restaurante realizada correctamente.');
      res.json(results);
    }
  );
});

// Add review:
app.post('/api/restaurants/:id/reviews', (req, res) => {
  const restaurantId = req.params.id;
  const { rating, comment, user_id } = req.body;
  logger.info(`Petición POST a /api/restaurants/${restaurantId}/reviews recibida.`);
  
  if (!rating || !comment || !user_id || !restaurantId) {
    logger.error('Error al añadir valoración del restaurante por falta de datos.');
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  const queryInsert = 'INSERT INTO reviews (user_id, rest_id, rating, comment) VALUES (?, ?, ?, ?)';
  connection.query(queryInsert, [user_id, restaurantId, rating, comment], (err, result) => {
    if (err) {
      logger.error(`Error al añadir valoración del restaurante: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }

    const queryUpdate = `UPDATE restaurants SET average_rating = (SELECT AVG(rating) FROM reviews WHERE rest_id = ?) WHERE id = ?;`;
    connection.query(queryUpdate, [restaurantId, restaurantId], (err) => {
      if (err) {
        logger.error(`Error al actualizar la calificación del restaurante: ${err.message}`);
        return res.status(500).json({ error: 'Error al actualizar la calificación promedio.' });
      }
      logger.info('Inserción de la valoración del restaurante realizada correctamente.');
      res.status(201).json({ message: 'Valoración añadida correctamente' });
    });
  });
});

// Delete review:
app.delete('/api/reviews/:id', (req, res) => {
  const reviewId = req.params.id;
  const getRestaurantIdQuery = 'SELECT rest_id FROM reviews WHERE id = ?';
  logger.info(`Petición DELETE a /api/reviews/${reviewId} recibida.`);

  connection.query(getRestaurantIdQuery, [reviewId], (err, result) => {
    if (err) {
      logger.error(`Error al buscar valoración del restaurante: ${err.message}`);
      return res.status(500).json({ success: false, message: 'Error al obtener la valoración' });
    }
    if (result.length === 0) {
      logger.error('Error al buscar valoración del restaurante.');
      return res.status(404).json({ success: false, message: 'Valoración no encontrada' });
    }

    const restaurantId = result[0].rest_id;
    const deleteQuery = 'DELETE FROM reviews WHERE id = ?';
    connection.query(deleteQuery, [reviewId], (err, deleteResult) => {
      if (err) {
        logger.error(`Error al eliminar valoración del restaurante: ${err.message}`);
        return res.status(500).json({ success: false, message: 'Error al eliminar la valoración' });
      }
      if (deleteResult.affectedRows === 0) {
        logger.error('Error al buscar valoración del restaurante.');
        return res.status(404).json({ success: false, message: 'Valoración no encontrada' });
      }

      const updateQuery = `UPDATE restaurants SET average_rating = (SELECT AVG(rating) FROM reviews WHERE rest_id = ?) WHERE id = ?;`;
      connection.query(updateQuery, [restaurantId, restaurantId], (err) => {
        if (err) {
          logger.error(`Error al actualizar la calificación del restaurante: ${err.message}`);
          return res.status(500).json({ success: false, message: 'Error al actualizar la calificación promedio.'});
        }
        logger.info('Eliminación de la valoración del restaurante realizada correctamente.');
        res.status(200).json({ success: true, message: 'Valoración eliminada correctamente' });
      });
    });
  });
});

// Get users:
app.get('/api/users', (req, res) => {
  logger.info(`Petición GET a /api/users recibida.`);

  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      logger.error(`Error al consultar los usuarios: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
    logger.info('Consulta a los usuarios realizada correctamente.');
    res.json(results);
  });
});

// Check login:
app.post('/api/login', (req, res) => {
  const { mail, pass } = req.body;
  logger.info(`Petición POST a /api/login recibida.`);

  connection.query('SELECT * FROM users WHERE mail = ?', [mail], (err, results) => {
    if (err) {
      logger.error(`Error al buscar usuario: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(pass, user.pass, (err, result) => {
        if (result) {
          logger.info('Inicio de sesión correcto.');
          res.json({ success: true, name: user.name, id: user.id, rol: user.rol });
        } else {
          logger.error('Inicio de sesión incorrecto.');
          res.json({ success: false });
        }
      });
    } else {
      logger.error('Inicio de sesión incorrecto.');
      res.json({ success: false });
    }
  });
});

// Register user:
app.post('/api/register', async (req, res) => {
  const { name, lastName, location, mail, password } = req.body;
  logger.info(`Petición POST a /api/register recibida.`);

  if (!name || !lastName || !location || !mail || !password) {
    logger.error('Error al registrar usuario por falta de datos.');
    return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
  }

  try {
    const checkQuery = "SELECT * FROM users WHERE mail = ?";
    connection.query(checkQuery, [mail], async (err, results) => {
      if (err) {
        logger.error(`Error al buscar usuario: ${err.message}`);
        return res.status(500).json({ success: false, message: "Error en el servidor." });
      }

      if (results.length > 0) {
        logger.error('Error al registrar usuario por correo ya registrado.');
        return res.status(400).json({ success: false, message: "El correo ya está registrado." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const query = "INSERT INTO users (name, lastname, location, mail, pass, rol) VALUES (?, ?, ?, ?, ?, 'user')";
      connection.query(query, [name, lastName, location, mail, hashedPassword], (err, result) => {
        if (err) {
          logger.error(`Error al registrar usuario: ${err.message}`);
          return res.status(500).json({ success: false, message: err.message });
        }
        logger.info('Registro de usuario realizado correctamente.');
        res.status(201).json({ success: true, message: 'Usuario registrado correctamente' });
      });
    });
  } catch (error) {
    logger.error(`Error al procesar el registro: ${error.message}`);
    res.status(500).json({ success: false, message: "Error al procesar el registro." });
  }
});

const server = app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

module.exports = { app, server }; 
