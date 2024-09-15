const path = require('path');
const dotenv = require('dotenv').config(path, '../.env');
const contrib = require('./contrib');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

module.exports.calcu26 = (req, res) => {
	const { description, gross_salary, costs_of_income, tax_advance, tax_reduction, calcContributions, studStatus, sixthBtnClicked } = req.body;

	// Sprawdzenie, czy wszystkie wymagane dane są dostępne
	if (gross_salary == null || costs_of_income == null || tax_advance == null || tax_reduction == null || calcContributions == null) {
		return res.status(400).json({ error: 'Brak wymaganych danych' });
	}

	const contributions = contrib.contrib;

	if (sixthBtnClicked) {
		const { penContrib, disContrib, sickContrib, hiPremium } = contributions(calcContributions);
		const penAmount = gross_salary * penContrib;
		const disAmount = gross_salary * disContrib;
		const sickAmount = gross_salary * sickContrib;
		const sumZus = penAmount + disAmount + sickAmount;

		// Obliczenie składki zdrowotnej
		const healthInsurancePremium = gross_salary * hiPremium;

		// Obliczenia na podstawie dostarczonych danych
		const income = gross_salary - sumZus - costs_of_income;
		const netSalary = parseFloat((gross_salary - sumZus - healthInsurancePremium).toFixed(2));

		const calcsU26 = {
			description,
			grossSalary: gross_salary, // wynagrodzenie brutto
			tax_reduction, // kwota obniżająca podatek
			penContrib: penAmount, // składka emerytalna
			disContrib: disAmount, // składka rentowa
			sickContrib: sickAmount, // składka chorobowa
			sumZus, // suma składek ZUS
			hiPremium: healthInsurancePremium, // składka na ubezpieczenie zdrowotne
			costs_of_income: 0, // koszty uzyskania przychodu
			basisOfTaxPaym: 0, // podstawa obliczenia zaliczki
			advPayment: 0, // zaliczka na podatek
			netSalary, // wynagrodzenie netto
		};
		const token = jwt.sign({ calcsU26 }, SECRET_KEY, { expiresIn: '1h' });

		// Send the response
		return res.json({ token });
	}

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

	const { penContrib, disContrib, sickContrib, hiPremium } = contributions(calcContributions);

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

	return res.json({ token });
};

module.exports.calcu26GET = (req, res) => {
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
};
