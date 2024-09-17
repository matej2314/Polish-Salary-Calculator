'use strict';
const connection = require('../db'); // Importujemy połączenie z db.js
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');

exports.registeruser = async (req, res) => {
	try {
		const { reg_username, reg_email, reg_passwd, rep_reg_passwd } = req.body;

		if (!reg_username || !reg_email || !reg_passwd || !rep_reg_passwd) {
			console.log('Brak wymaganych danych');
			return res.status(400).send('Proszę uzupełnić wszystkie pola.');
		}

		connection.query('SELECT email FROM users WHERE email = ?', [reg_email], async (error, results) => {
			if (error) {
				console.log('Błąd SELECT:', error);
				return res.status(500).send('Błąd serwera.');
			}

			if (results.length > 0) {
				console.log('E-mail already registered');
				return res.status(400).send('Ten adres e-mail jest już zarejestrowany.');
			}

			if (reg_passwd !== rep_reg_passwd) {
				console.log('Passwords do not match');
				return res.status(400).send('Hasła muszą być identyczne.');
			}

			try {
				let hashedPasswd = await bcrypt.hash(reg_passwd, 10);

				connection.query('INSERT INTO users SET ?', { name: reg_username, email: reg_email, password: hashedPasswd }, (error, results) => {
					if (error) {
						console.log('Błąd INSERT:', error);
						return res.status(500).send('Błąd serwera.');
					}
					console.log('User successfully inserted:', results);
					res.redirect('/');
				});
			} catch (err) {
				console.log('Błąd podczas haszowania hasła:', err);
				return res.status(500).send('Błąd serwera.');
			}
		});
	} catch (err) {
		console.log('Błąd główny:', err);
		return res.status(500).send('Błąd serwera.');
	}
};

exports.loginuser = (req, res) => {
	const { username, userpasswd } = req.body;

	if (!username || !userpasswd) {
		return res.status(400).send('Proszę uzupełnić wszystkie pola.');
	}

	connection.query('SELECT * FROM users WHERE name = ?', [username], async (error, results) => {
		if (error) {
			console.log('Błąd SELECT:', error);
			return res.status(500).send('Błąd serwera.');
		}

		if (results.length === 0) {
			return res.status(400).send('Niepoprawny login lub hasło.');
		}

		const user = results[0];
		const isMatch = await bcrypt.compare(userpasswd, user.password);

		if (!isMatch) {
			return res.status(400).send('Niepoprawny login lub hasło.');
		}

		const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

		res.status(200).json({ message: 'Zalogowano pomyślnie.', token });
	});
};
