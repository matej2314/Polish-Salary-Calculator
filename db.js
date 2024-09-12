const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: '192.168.1.124',
	port: '3306',
	user: 'mateo2314',
	password: 'Ziomal1245*#',
	database: 'salary_calc_db',
});

connection.connect(error => {
	if (error) {
		console.error('MySQL connection error:', error);
		return;
	}
	console.log('MySQL_DB_CONNECTED');
});

module.exports = connection;
