'use strict';
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const connection = require('./db');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.set('view engine', 'ejs');

// Public Directory
const publicDirectoryPath = path.join(__dirname, '/');
app.use('/', express.static(publicDirectoryPath));

// Middleware to check JWT token
function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

// Routes setup
const indexRoutes = require('./routes/pages');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

// Start server
app.listen(8080, () => {
	console.log('Server is listening on port 8080');
});
