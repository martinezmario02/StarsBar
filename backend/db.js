const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'mariocc',    
  password: 'mariocc',
  database: 'starsbar' 
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

module.exports = connection;
