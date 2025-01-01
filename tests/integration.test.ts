import mysql from 'mysql2';

const request = require('supertest');

jest.setTimeout(30000); 

describe('Test de servicios del clúster de contenedores', () => {
  it('Debería acceder a la API del backend', async () => {
    const response = await request('http://localhost:3000')
      .get('/api/restaurants')
      .expect(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('Debería acceder a la vista del frontend', async () => {
    const response = await request('http://localhost:5173')
      .get('/')
      .expect(200);
    expect(response.statusCode).toBe(200);
  });

  it('Debería conectar con la base de datos MySQL', (done) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'mariocc',
      password: 'mariocc',
      database: 'starsbar',
      port: 3306
    });
  
    connection.connect((err) => {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  });

  it('Debería acceder a Kibana', async () => {
    const response = await request('http://localhost:5601')
      .get('/app/home')
      .expect(200);
    expect(response.statusCode).toBe(200);
  });

  it('Debería estar accesible Elasticsearch', async () => {
    const response = await request('http://localhost:9201')
      .get('/')
      .expect(200);
    expect(response.statusCode).toBe(200); 
  });

  // it('Debería estar corriendo Logstash', async () => {
  //   const response = await request('http://localhost:5044')
  //     .get('/')
  //     .expect(200);
  //   expect(response.statusCode).toBe(200); 
  // });
});
