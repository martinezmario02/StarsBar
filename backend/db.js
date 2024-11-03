const mysql = require('mysql2');
const dotenv = require('dotenv');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

function close() {
  if (connection) {
      connection.end((err) => {
          if (err) throw err;
          console.log('Conexión a la base de datos cerrada');
      });
  }
}
module.exports = connection; 
