const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost' || 'db',
  user: process.env.DB_USER || 'mariocc' || 'root',
  password: process.env.DB_PASSWORD || 'mariocc' || 'root',
  database: process.env.DB_NAME || 'starsbar',
});

function connect() {
  connection.connect((err) => {
    if (err) {
      console.error('Error conectando a la base de datos:', err);
      return;
    }
    console.log('Conexión a la base de datos establecida');
  });
}

function close() {
  connection.end((err) => {
    if (err) {
      console.error('Error cerrando la conexión:', err);
    } else {
      console.log('Conexión cerrada');
    }
  });
}

module.exports = connection;

