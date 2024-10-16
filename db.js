require('dotenv').config({ path: './.env' });
const logger = require('./controllers/logger');

const mysql = require('mysql2');

// Tworzenie połączenia do bazy danych MySQL
const connection = mysql.createConnection({
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || '3306',
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

// Próba nawiązania połączenia z bazą danych
connection.connect(function (error) {
	if (error) {
		logger.error('Error connecting to the database:', error);
		return;
	} else {
		logger.info('MYSQL_DB_CONNECTED');
	}
});

module.exports = connection;
