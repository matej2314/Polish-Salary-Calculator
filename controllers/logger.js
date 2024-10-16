const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logDir = path.join(__dirname, '../logs');

const logger = createLogger({
	format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
	transports: [
		new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }), // Zmieniona ścieżka
		new transports.File({ filename: path.join(logDir, 'combined.log') }), // Zmieniona ścieżka
	],
});

module.exports = logger;
