const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const contrib = require('./contrib');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

module.exports.calcu26 = (req, res) => {
	const { description, gross_salary, costs_of_income, tax_advance, tax_reduction, calcContributions, studStatus, sixthBtnClicked, specWrk } = req.body;

	// Sprawdzenie, czy wszystkie wymagane dane są dostępne
	if (gross_salary == null || costs_of_income == null || tax_advance == null || tax_reduction == null || calcContributions == null) {
		return res.status(400).json({ error: 'Brak wymaganych danych' });
	}

	const contributions = contrib.contrib;
	let calcsU26;

	// pracownik < 26 lat

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
		const netSalary = parseFloat((gross_salary - sumZus).toFixed(2));

		calcsU26 = {
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
			basisOfhInsurance: 0,
		};
	}

	// status studenta
	else if (studStatus) {
		const netSalary = parseFloat(gross_salary).toFixed(2); // Student's net salary equals gross salary

		calcsU26 = {
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
			basisOfhInsurance: 0,
		};
	}
	// umowa o dzieło
	else if (specWrk) {
		const income = Math.round(parseFloat(gross_salary - gross_salary * costs_of_income));
		const advPayment = Math.round(income * tax_advance);
		const netSalary = gross_salary - advPayment;
		const incomeCosts = parseFloat(gross_salary * costs_of_income);

		calcsU26 = {
			description,
			grossSalary: parseFloat(gross_salary),
			netSalary,
			tax_reduction: 0,
			penContrib: 0,
			disContrib: 0,
			sickContrib: 0,
			sumZus: 0,
			hiPremium: 0,
			costs_of_income: incomeCosts,
			basisOfTaxPaym: income,
			advPayment,
			basisOfhInsurance: 0,
		};
		const token = jwt.sign({ calcsU26 }, SECRET_KEY, { expiresIn: '1h' });

		// Send the response
		return res.json({ token });
	} else {
		//umowa zlecenie, pracownik > 26 lat
		const { penContrib, disContrib, sickContrib, hiPremium } = contributions(calcContributions);

		// Obliczenia składek
		const penAmount = gross_salary * penContrib;
		const disAmount = gross_salary * disContrib;
		const sickAmount = gross_salary * sickContrib;
		const sumZus = penAmount + disAmount + sickAmount;

		const income = gross_salary - sumZus;
		const basisOfhInsurance = gross_salary - sumZus;
		const healthInsurancePremium = (income * 0.09).toFixed(2);
		const costsincome = (income * costs_of_income).toFixed(2);
		const basisOfTaxPaym = parseFloat(basisOfhInsurance - costsincome);
		const advPayment = Number(basisOfTaxPaym * tax_advance);
		const netSalary = parseFloat(basisOfhInsurance - healthInsurancePremium);

		// Utworzenie obiektu z wynikami obliczeń
		calcsU26 = {
			description,
			grossSalary: gross_salary, // wynagrodzenie brutto
			tax_reduction, // kwota obniżająca podatek
			penContrib: penAmount, // składka emerytalna
			disContrib: disAmount, // składka rentowa
			sickContrib: sickAmount, // składka chorobowa
			sumZus, // suma składek ZUS
			hiPremium: healthInsurancePremium, // składka na ubezpieczenie zdrowotne
			costs_of_income: costsincome, // koszty uzyskania przychodu
			basisOfTaxPaym, // podstawa obliczenia zaliczki
			basisOfhInsurance,
			advPayment, // zaliczka na podatek
			netSalary, // wynagrodzenie netto
		};
	}

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
