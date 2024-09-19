const path = require('path');

const dotenv = require('dotenv').config(path, '../.env');

const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

module.exports.calcresult = (req, res) => {
	const { description, gross_salary, tax_reduction, pen_Contrib, dis_Contrib, sick_Contrib, hIpremium, costs_of_income, tax_advance, disableSelects, financedemployer, financedbyemployee } = req.body;

	if (gross_salary == null || costs_of_income == null || tax_advance == null || tax_reduction == null || pen_Contrib == null || dis_Contrib == null || sick_Contrib == null) {
		return res.status(400).json({ error: 'Brak wymaganych danych' });
	}

	let calcresults;
	let token;

	if (disableSelects) {
		const penContrib = parseFloat(gross_salary * pen_Contrib);
		const disContrib = parseFloat(gross_salary * dis_Contrib);
		const sickContrib = parseFloat(gross_salary * sick_Contrib);
		const sumZus = parseFloat(penContrib + disContrib + sickContrib);
		const hiPremium = Number((gross_salary - sumZus) * hIpremium).toFixed(2);
		const income = parseFloat(gross_salary - sumZus - costs_of_income);
		const netSalary = parseFloat((gross_salary - sumZus - parseFloat(hiPremium)).toFixed(2));
		const basisOfhInsurance = gross_salary - sumZus;

		calcresults = {
			description: description,
			grossSalary: parseFloat(gross_salary),
			tax_reduction,
			penContrib,
			disContrib,
			sickContrib,
			sumZus,
			hiPremium,
			costs_of_income: costs_of_income,
			basisOfTaxPaym: 0,
			advPayment: 0,
			tax_reduction: 0,
			tax_advance: 0,
			netSalary,
			basisOfhInsurance,
		};

		token = jwt.sign({ calcresults }, SECRET_KEY, { expiresIn: '1h' });
		return res.json({ token });
	} else {
		const penContrib = parseFloat(gross_salary * pen_Contrib);
		const disContrib = parseFloat(gross_salary * dis_Contrib);
		const sickContrib = parseFloat(gross_salary * sick_Contrib);
		const sumZus = parseFloat(gross_salary * 0.1371);
		const hiPremium = Number((gross_salary - sumZus) * hIpremium).toFixed(2);
		const income = parseFloat(gross_salary - sumZus - costs_of_income);
		const basisOfTaxPaym = Math.round(parseFloat(gross_salary - sumZus - costs_of_income));
		const basisOfhInsurance = gross_salary - sumZus;
		const advPayment = Number(basisOfTaxPaym * tax_advance - tax_reduction) < 0 ? 0 : Number(basisOfTaxPaym * tax_advance - tax_reduction);
		const netSalary = parseFloat((gross_salary - sumZus - advPayment - costs_of_income).toFixed(3));

		calcresults = {
			description: description,
			grossSalary: parseFloat(gross_salary),
			tax_reduction,
			penContrib,
			disContrib,
			sickContrib,
			sumZus,
			hiPremium,
			costs_of_income,
			basisOfTaxPaym,
			basisOfhInsurance,
			advPayment,
			netSalary,
		};

		token = jwt.sign({ calcresults }, SECRET_KEY, { expiresIn: '1h' });
		return res.json({ token });
	}
};

module.exports.calcresultGET = (req, res) => {
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
};
