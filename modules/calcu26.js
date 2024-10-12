const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const contrib = require('./contrib');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

module.exports.calcu26 = (req, res) => {
	const { description, gross_salary, costs_of_income, tax_advance, tax_reduction, calcContributions, studStatus, sixthBtnClicked, specWrk } = req.body;

	// checking data availability
	if (gross_salary == null || costs_of_income == null || tax_advance == null || tax_reduction == null || calcContributions == null) {
		return res.status(400).json({ error: 'Brak wymaganych danych' });
	}

	const contributions = contrib.contrib;
	let calcsU26;

	// emplloyee under 26 years of age

	if (sixthBtnClicked) {
		const { penContrib, disContrib, sickContrib, hiPremium } = contributions(calcContributions);
		const penAmount = gross_salary * penContrib;
		const disAmount = gross_salary * disContrib;
		const sickAmount = gross_salary * sickContrib;
		const sumZus = penAmount + disAmount + sickAmount;

		// calc of premium health contribution
		const healthInsurancePremium = gross_salary * hiPremium;

		// calcs based on req.body data
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

	// student status
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
	//contract for specific work
	else if (specWrk) {
		const income = Math.round(parseFloat(gross_salary - gross_salary * costs_of_income));
		const advPayment = Math.round(income * tax_advance);
		const incomeCosts = parseFloat(gross_salary * costs_of_income);
		const netSalary = gross_salary - incomeCosts;

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
		//contract of mandate, employee above 26 years old
		const { penContrib, disContrib, sickContrib, hiPremium } = contributions(calcContributions);

		// calcs of contributions
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

		// Create object with results of calculations
		calcsU26 = {
			description,
			grossSalary: gross_salary, // Gross salary
			tax_reduction, // tax reduction value
			penContrib: penAmount, // pension contribution
			disContrib: disAmount, // second pension contribution
			sickContrib: sickAmount, // sickness contribution
			sumZus, // sum of ZUS contributions
			hiPremium: healthInsurancePremium, // health insurance premium
			costs_of_income: costsincome, // costs of income
			basisOfTaxPaym, // basis for calculating advance payment of income tax
			basisOfhInsurance, // basis for calculating health insurance premium
			advPayment, // advance tax payment
			netSalary, // net salary
		};
	}

<<<<<<< HEAD
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
	const calcsU26 = {
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

	// Utworzenie tokena z wynikami
	const token = jwt.sign({ calcsU26 }, SECRET_KEY, { expiresIn: '1h' }); // Token ważny przez 1 godzinę

	// Odesłanie tokena w odpowiedzi
=======
	// Create token with results
	const token = jwt.sign({ calcsU26 }, SECRET_KEY, { expiresIn: '1h' }); // token valid for 1 hour

	// response
>>>>>>> 149e9d77eb958f6c9ff13826db40875f61ddbf60

	return res.json({ token });
};

module.exports.calcu26GET = (req, res) => {
	// getting JWT token from header request
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
