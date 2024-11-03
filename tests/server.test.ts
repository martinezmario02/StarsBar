import request from 'supertest';
import { app, server } from '../backend/server';
import connection from '../backend/db';
import bcrypt from 'bcrypt';

afterAll(async () => {
  await connection.end(); // Close DB connection if necessary
  await server.close(); // Close the server
});

// ------------------------------------------------------------------------------------
// ------------------------TESTS FOR RESTAURANTS---------------------------------------
// ------------------------------------------------------------------------------------

// Check restaurants:
describe('GET /api/restaurants', () => {
  it('should handle errors correctly', async () => {
    const originalQuery = connection.query;
    connection.query = (query: any, callback: any) => {
      callback(new Error('Simulated error'), null);
    };

    const response = await request(app).get('/api/restaurants');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Simulated error');

    connection.query = originalQuery;
  });
});

// Check restaurant info:
describe('GET /api/restaurants/:id', () => {
  afterAll((done) => {
    server.close(done);
  });

  it('should return a single restaurant', async () => {
    const mockRestaurant = { id: 1, name: 'Test Restaurant', location: 'Test Location' };
    const originalQuery = connection.query;
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('WHERE id = ?')) {
        callback(null, [mockRestaurant]);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app).get('/api/restaurants/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRestaurant);

    connection.query = originalQuery;
  });

  it('should return 404 if restaurant not found', async () => {
    const originalQuery = connection.query;
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('WHERE id = ?')) {
        callback(null, []);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app).get('/api/restaurants/999'); 
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Restaurante no encontrado');

    connection.query = originalQuery; 
  });

  it('should handle errors correctly', async () => {
    const originalQuery = connection.query;
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('WHERE id = ?')) {
        callback(new Error('Simulated error'), null);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app).get('/api/restaurants/1');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Simulated error');

    connection.query = originalQuery; 
  });
});

// ------------------------------------------------------------------------------------
// --------------------------TESTS FOR REVIEWS-----------------------------------------
// ------------------------------------------------------------------------------------

// Check reviews:
describe('GET /api/restaurants/:id/reviews', () => {
  it('should return a list of reviews for a restaurant', async () => {
    const mockReviews = [
      { id: 1, rating: 5, comment: 'Great!', name: 'User1', created_at: '2023-01-01' },
      { id: 2, rating: 4, comment: 'Good', name: 'User2', created_at: '2023-01-02' }
    ];
    const originalQuery = connection.query;
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('WHERE r.rest_id = ?')) {
        callback(null, mockReviews);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app).get('/api/restaurants/1/reviews');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReviews);

    connection.query = originalQuery; 
  });

  it('should handle errors correctly', async () => {
    const originalQuery = connection.query;
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('WHERE r.rest_id = ?')) {
        callback(new Error('Simulated error'), null);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app).get('/api/restaurants/1/reviews');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Simulated error');

    connection.query = originalQuery; 
  });
});

// Check added reviews:
describe('POST /api/restaurants/:id/reviews', () => {
  it('should add a review for a restaurant', async () => {
    const mockReview = { rating: 5, comment: 'Great!', user_id: 1 };
    const mockInsertResult = { insertId: 1 };
    const originalQuery = connection.query;
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('INSERT INTO reviews')) {
        callback(null, mockInsertResult);
      } else if (query.includes('UPDATE restaurants SET average_rating')) {
        callback(null);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app)
      .post('/api/restaurants/1/reviews')
      .send(mockReview);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Valoración añadida correctamente');

    connection.query = originalQuery; 
  });

  it('should return 400 if any field is missing', async () => {
    const response = await request(app)
      .post('/api/restaurants/1/reviews')
      .send({ rating: 5, comment: 'Great!' }); 
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Todos los campos son requeridos.');
  });

  it('should handle errors correctly during insertion', async () => {
    const mockReview = { rating: 5, comment: 'Great!', user_id: 1 };
    const originalQuery = connection.query;
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('INSERT INTO reviews')) {
        callback(new Error('Simulated error'), null);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app)
      .post('/api/restaurants/1/reviews')
      .send(mockReview);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Simulated error');

    connection.query = originalQuery; 
  });

  it('should handle errors correctly during rating update', async () => {
    const mockReview = { rating: 5, comment: 'Great!', user_id: 1 };
    const mockInsertResult = { insertId: 1 };
    const originalQuery = connection.query;
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('INSERT INTO reviews')) {
        callback(null, mockInsertResult);
      } else if (query.includes('UPDATE restaurants SET average_rating')) {
        callback(new Error('Simulated update error'), null);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app)
      .post('/api/restaurants/1/reviews')
      .send(mockReview);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Error al actualizar la calificación promedio.');

    connection.query = originalQuery; 
  });
});

// Check removed reviews:
describe('DELETE /api/reviews/:id', () => {
  it('should delete a review and update the average rating', async () => {
    const reviewId = 1;
    const restaurantId = 1;
    const originalQuery = connection.query;
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('SELECT rest_id FROM reviews WHERE id = ?')) {
        callback(null, [{ rest_id: restaurantId }]);
      } else if (query.includes('DELETE FROM reviews WHERE id = ?')) {
        callback(null, { affectedRows: 1 });
      } else if (query.includes('UPDATE restaurants SET average_rating')) {
        callback(null);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app).delete(`/api/reviews/${reviewId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Reseña eliminada correctamente');

    connection.query = originalQuery; 
  });

  it('should return 404 if review not found', async () => {
    const reviewId = 999; 
    const originalQuery = connection.query;
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('SELECT rest_id FROM reviews WHERE id = ?')) {
        callback(null, []);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app).delete(`/api/reviews/${reviewId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Reseña no encontrada');

    connection.query = originalQuery; 
  });

  it('should handle errors correctly during deletion', async () => {
    const reviewId = 1;
    const originalQuery = connection.query;
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('SELECT rest_id FROM reviews WHERE id = ?')) {
        callback(null, [{ rest_id: 1 }]);
      } else if (query.includes('DELETE FROM reviews WHERE id = ?')) {
        callback(new Error('Simulated error'), null);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app).delete(`/api/reviews/${reviewId}`);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Error al eliminar la reseña');

    connection.query = originalQuery; 
  });

  it('should handle errors correctly during rating update', async () => {
    const reviewId = 1;
    const restaurantId = 1;
    const originalQuery = connection.query;
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('SELECT rest_id FROM reviews WHERE id = ?')) {
        callback(null, [{ rest_id: restaurantId }]);
      } else if (query.includes('DELETE FROM reviews WHERE id = ?')) {
        callback(null, { affectedRows: 1 });
      } else if (query.includes('UPDATE restaurants SET average_rating')) {
        callback(new Error('Simulated update error'), null);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app).delete(`/api/reviews/${reviewId}`);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Error al actualizar la calificación promedio.');

    connection.query = originalQuery; 
  });
});

// ------------------------------------------------------------------------------------
// ---------------------------TESTS FOR USERS------------------------------------------
// ------------------------------------------------------------------------------------

// Check users:
describe('GET /api/users', () => {
  it('should handle errors correctly', async () => {
    const originalQuery = connection.query;
    connection.query = (query: any, callback: any) => {
      callback(new Error('Simulated error'), null);
    };

    const response = await request(app).get('/api/users');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Simulated error');

    connection.query = originalQuery;
  });
});

// Check login:
describe('POST /api/login', () => {
  it('should return success false for invalid credentials', async () => {
    const mockUser = { id: 1, name: 'Test User', mail: 'test@example.com', pass: 'hashedpassword', rol: 'user' };
    const originalQuery = connection.query.bind(connection);
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('SELECT * FROM users WHERE mail = ?')) {
        callback(null, [mockUser]);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const originalCompare = bcrypt.compare;
    bcrypt.compare = (pass: string, hash: string, callback: Function) => {
      callback(null, false); 
    };

    const response = await request(app)
      .post('/api/login')
      .send({ mail: 'test@example.com', pass: 'wrongpassword' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: false });

    connection.query = originalQuery;
    bcrypt.compare = originalCompare; 
  });

  it('should return success false if user not found', async () => {
    const originalQuery = connection.query.bind(connection);
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('SELECT * FROM users WHERE mail = ?')) {
        callback(null, []); 
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app)
      .post('/api/login')
      .send({ mail: 'nonexistent@example.com', pass: 'password' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: false });

    connection.query = originalQuery;
  });

  it('should handle errors correctly', async () => {
    const originalQuery = connection.query.bind(connection);
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('SELECT * FROM users WHERE mail = ?')) {
        callback(new Error('Simulated error'), null);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app)
      .post('/api/login')
      .send({ mail: 'test@example.com', pass: 'password' });
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Simulated error');

    connection.query = originalQuery;
  });
});

// Check user registration:
describe('POST /api/register', () => {
  it('should register a new user', async () => {
    const mockUser = { name: 'Test', lastName: 'User', location: 'Test Location', mail: 'test@example.com', password: 'password' };
    const originalQuery = connection.query.bind(connection);
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('SELECT * FROM users WHERE mail = ?')) {
        callback(null, []); 
      } else if (query.includes('INSERT INTO users')) {
        callback(null, { insertId: 1 });
      } else {
        originalQuery(query, values, callback);
      }
    };

    const originalHash = bcrypt.hash;
    bcrypt.hash = (password: string, saltRounds: number) => {
      return Promise.resolve('hashedpassword'); 
    };

    const response = await request(app)
      .post('/api/register')
      .send(mockUser);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true, message: 'Usuario registrado correctamente' });

    connection.query = originalQuery; 
    bcrypt.hash = originalHash; 
  });

  it('should return 400 if any field is missing', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ name: 'Test', lastName: 'User', location: 'Test Location', mail: 'test@example.com' }); 
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Todos los campos son obligatorios.');
  });

  it('should return 400 if email is already registered', async () => {
    const mockUser = { name: 'Test', lastName: 'User', location: 'Test Location', mail: 'test@example.com', password: 'password' };
    const originalQuery = connection.query.bind(connection);
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('SELECT * FROM users WHERE mail = ?')) {
        callback(null, [{ id: 1, mail: 'test@example.com' }]); 
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app)
      .post('/api/register')
      .send(mockUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'El correo ya está registrado.');

    connection.query = originalQuery;
  });

  it('should handle server errors correctly', async () => {
    const mockUser = { name: 'Test', lastName: 'User', location: 'Test Location', mail: 'test@example.com', password: 'password' };
    const originalQuery = connection.query.bind(connection);
    connection.query = (query: string, values: any[], callback: Function) => {
      if (query.includes('SELECT * FROM users WHERE mail = ?')) {
        callback(new Error('Simulated error'), null);
      } else {
        originalQuery(query, values, callback);
      }
    };

    const response = await request(app)
      .post('/api/register')
      .send(mockUser);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Error en el servidor.');

    connection.query = originalQuery; 
  });
});