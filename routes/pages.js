const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const pdfController = require('../controllers/pdfController');
const contrib = require('../modules/contrib');
const calcresult = require('../modules/calcResults');
const calcu26 = require('../modules/calcu26');

// Sekret używany do podpisywania tokenów JWT
const SECRET_KEY = process.env.JWT_SECRET;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
	// res.sendFile(path.join(__dirname, '../index.html'));
	const referer = req.get('Referer') || '';

	if (referer.includes('/register')) {
		res.sendFile(path.join(__dirname, '../index.html'));
	} else {
		res.sendFile(path.join(__dirname, '../index.html')); // Możesz dostosować inne ścieżki i komunikaty
	}
});

router.get('/register', (req, res) => {
	res.sendFile(path.join(__dirname, '../register.html'));
});

router.get('/calc-order', (req, res) => {
	res.sendFile(path.join(__dirname, '../calc-order-spec.html'));
});

router.get('/main-calc', (req, res) => {
	res.sendFile(path.join(__dirname, '../main_calc.html'));
});

router.get('/buttons', (req, res) => {
	res.sendFile(path.join(__dirname, '../buttons.html'));
});

router.post('/calcresult', calcresult.calcresult);

router.get('/calcresult', calcresult.calcresultGET);

router.post('/calcu26', calcu26.calcu26);

router.get('/calcu26', calcu26.calcU26GET);

router.post('/generate-pdf', pdfController.generatePDF);

router.get('/results', (req, res) => {
	res.sendFile(path.join(__dirname, '../results.html'));
});

module.exports = router;
