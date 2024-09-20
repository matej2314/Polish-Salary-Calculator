const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const generatePDF = require('../controllers/generatePDF');
const generateXLSX = require('../controllers/generateXLSX');
const calcresult = require('../modules/calcResults');
const calcu26 = require('../modules/calcu26');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
	const referer = req.get('Referer') || '';

	if (referer.includes('/register')) {
		res.sendFile(path.join(__dirname, '../index.html'));
	} else {
		res.sendFile(path.join(__dirname, '../index.html'));
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

router.get('/calcu26', calcu26.calcu26GET);

router.get('/generate-pdf', generatePDF);

router.get('/generate-excel', generateXLSX.generateXLSX);

router.get('/results', (req, res) => {
	res.sendFile(path.join(__dirname, '../results.html'));
});

module.exports = router;
