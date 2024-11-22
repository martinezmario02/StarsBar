// const mysql = require('mysql2');
// const dotenv = require('dotenv');

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'mariocc',    
//   password: 'mariocc',
//   database: 'starsbar' 
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error conectando a la base de datos:', err);
//     return;
//   }
//   console.log('Conexión a la base de datos establecida');
// });

// function close() {
//   if (connection) {
//       connection.end((err) => {
//           if (err) throw err;
//           console.log('Conexión a la base de datos cerrada');
//       });
//   }
// }
// module.exports = connection; 

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'mariocc',
  password: process.env.DB_PASSWORD || 'mariocc',
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

