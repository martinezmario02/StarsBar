import request from 'supertest';
import { app, server } from '../backend/server';
import connection from '../backend/db';

// Check restaurants:
describe('GET /api/restaurants', () => {
  it('should return a list of restaurants', async () => {
    const response = await request(app).get('/api/restaurants');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

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