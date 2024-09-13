require('dotenv').config({ path: './.env' });

const mysql = require('mysql2');

// Tworzenie połączenia do bazy danych MySQL
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

// Próba nawiązania połączenia z bazą danych
connection.connect(function (error) {
	if (error) {
		console.log('Error connecting to the database:', error);
		return;
	} else {
		console.log('MYSQL_DB_CONNECTED');
	}
});

module.exports = connection;
