const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
let calcresults;

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

router.post('/calcu26', (req, res) => {
	const { description, gross_salary, costs_of_income, tax_advance, tax_reduction, calcContributions, studStatus } = req.body;

	if (studStatus) {
		const netSalary = parseFloat(gross_salary).toFixed(2); // Student's net salary equals gross salary
		const calcsU26 = {
			description,
			grossSalary: parseFloat(gross_salary),
			netSalary, // Set netSalary equal to gross_salary for students
			tax_reduction: 0,
			penContrib: 0,
			disContrib: 0,
			sickContrib: 0,
			sumZus: 0,
			hiPremium: 0,
			costs_of_income: 0,
			basisOfTaxPaym: 0,
			advPayment: 0,
		};

		// Generate token
		const token = jwt.sign({ calcsU26 }, SECRET_KEY, { expiresIn: '1h' });

		// Send the response
		return res.json({ token });
	}

	// Sprawdzenie, czy wszystkie wymagane dane są dostępne
	if (!gross_salary || !costs_of_income || !tax_advance || !tax_reduction || !calcContributions) {
		return res.status(400).json({ error: 'Brak wymaganych danych' });
	}

	// Funkcja zwracająca składki w zależności od wyboru użytkownika
	const getContributions = type => {
		switch (type) {
			case 'wszystkie':
				return { penContrib: 0.0976, disContrib: 0.015, sickContrib: 0.0245, hiPremium: 0.09 };
			case 'bez-skladki-chorobowej':
				return { penContrib: 0.0976, disContrib: 0.015, sickContrib: 0, hiPremium: 0.09 };
			case 'bez-ubezpieczenia-spolecznego':
				return { penContrib: 0, disContrib: 0, sickContrib: 0, hiPremium: 0 };
			case 'bez-ubezpieczenia-spolecznego-i-zdrowotnego':
				return { penContrib: 0, disContrib: 0, sickContrib: 0, hiPremium: 0 };
			case 'bez-skladek-emerytalno-rentowych':
				return { penContrib: 0, disContrib: 0, sickContrib: 0.0245, hiPremium: 0.09 };
			default:
				return { penContrib: 0, disContrib: 0, sickContrib: 0, hiPremium: 0.09 }; // Domyślna wartość
		}
	};

	// Wywołanie funkcji z odpowiednim parametrem
	const { penContrib, disContrib, sickContrib, hiPremium } = getContributions(calcContributions);

	// Obliczenia składek
	const penAmount = gross_salary * penContrib;
	const disAmount = gross_salary * disContrib;
	const sickAmount = gross_salary * sickContrib;
	const sumZus = penAmount + disAmount + sickAmount;

	// Obliczenie składki zdrowotnej
	const healthInsurancePremium = gross_salary * hiPremium;

	// Obliczenia na podstawie dostarczonych danych
	const income = gross_salary - sumZus - costs_of_income;
	const advPayment = Number((income * 0.12).toFixed(2));
	const netSalary = parseFloat((gross_salary - sumZus - healthInsurancePremium - advPayment).toFixed(2));
	const basisOfTaxPaym = parseFloat(income - costs_of_income);

	// Utworzenie obiektu z wynikami obliczeń
	const calcsU26 = {
		description,
		grossSalary: gross_salary, // wynagrodzenie brutto
		tax_reduction, // kwota obniżająca podatek
		penContrib: penAmount, // składka emerytalna
		disContrib: disAmount, // składka rentowa
		sickContrib: sickAmount, // składka chorobowa
		sumZus, // suma składek ZUS
		hiPremium: healthInsurancePremium, // składka na ubezpieczenie zdrowotne
		costs_of_income, // koszty uzyskania przychodu
		basisOfTaxPaym, // podstawa obliczenia zaliczki
		advPayment, // zaliczka na podatek
		netSalary, // wynagrodzenie netto
	};

	// Utworzenie tokena z wynikami
	const token = jwt.sign({ calcsU26 }, SECRET_KEY, { expiresIn: '1h' }); // Token ważny przez 1 godzinę

	// Odesłanie tokena w odpowiedzi
	res.json({ token });
});

router.get('/calcu26', (req, res) => {
	// Pobieranie tokenu JWT z nagłówka Authorization
	const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

	if (!token) {
		return res.status(401).json({ error: 'Błąd uwierzytelniania.' });
	}

	jwt.verify(token, SECRET_KEY, (err, decoded) => {
		if (err) {
			return res.status(403).json({ error: 'Niewłaściwy token' });
		}

		res.json(decoded.calcsU26);
	});
});

router.post('/calcresult', (req, res) => {
	const { description, gross_salary, tax_reduction, pen_Contrib, dis_Contrib, sick_Contrib, hIpremium, costs_of_income, tax_advance, financedemployer, financedbyemployee } = req.body;

	const penContrib = parseFloat(gross_salary * pen_Contrib);
	const disContrib = parseFloat(gross_salary * dis_Contrib);
	const sickContrib = parseFloat(gross_salary * sick_Contrib);
	const sumZus = parseFloat(penContrib + disContrib + sickContrib);
	const hiPremium = parseFloat((gross_salary - sumZus) * hIpremium).toFixed(2);
	const income = parseFloat(gross_salary - sumZus - costs_of_income);
	const basisOfTaxPaym = parseFloat(income - costs_of_income - sumZus);
	const advPayment = Number((income * tax_advance).toFixed(2));
	const netSalary = parseFloat((gross_salary - sumZus - hiPremium - advPayment).toFixed(2));

	calcresults = {
		description: description,
		grossSalary: parseFloat(gross_salary), // wynagrodzenie brutto
		tax_reduction: tax_reduction, // kwota obniżająca podatek
		penContrib, //  składka emerytalna
		disContrib, //składka rentowa
		sickContrib, //składka chorobowa
		sumZus, // suma składek zus
		hiPremium, // składka na ubezpieczenie zdrowotne
		costs_of_income: costs_of_income, // koszty uzyskania przychodu
		basisOfTaxPaym, // podstawa obliczenia zaliczki
		advPayment, // zaliczka na podatek
		netSalary, // wynagrodzenie netto
	};

	// Generowanie tokenu JWT z wynikami obliczeń
	const token = jwt.sign({ calcresults }, SECRET_KEY, { expiresIn: '1h' }); // Token ważny przez 1 godzinę

	// Wysłanie tokenu do klienta (może być w nagłówku lub jako odpowiedź JSON)
	res.json({ token });
});

router.get('/calcresult', (req, res) => {
	// Pobieranie tokenu JWT z nagłówka Authorization
	const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

	if (!token) {
		return res.status(401).json({ error: 'Błąd uwierzytelniania.' });
	}

	jwt.verify(token, SECRET_KEY, (err, decoded) => {
		if (err) {
			return res.status(403).json({ error: 'Niewłaściwy token' });
		}

		res.json(decoded.calcresults);
	});
});

router.get('/results', (req, res) => {
	res.sendFile(path.join(__dirname, '../results.html'));
});

module.exports = router;
