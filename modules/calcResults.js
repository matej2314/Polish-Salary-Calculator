const path = require('path');

const dotenv = require('dotenv').config(path, '../.env');

const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

module.exports.calcresult = (req, res) => {
	const { description, gross_salary, tax_reduction, pen_Contrib, dis_Contrib, sick_Contrib, hIpremium, costs_of_income, tax_advance, disableSelects, financedemployer, financedbyemployee, ppkChecked } = req.body;

	if (gross_salary == null || costs_of_income == null || tax_advance == null || tax_reduction == null || pen_Contrib == null || dis_Contrib == null || sick_Contrib == null) {
		return res.status(400).json({ error: 'Brak wymaganych danych' });
	}

	let token;
	let netSalary;
	const finemployee = financedbyemployee / 100;

	//pracownik < 26 r.ż.
	if (disableSelects) {
		const penContrib = Number(gross_salary * pen_Contrib);
		const disContrib = Number(gross_salary * dis_Contrib);
		const sickContrib = Number(gross_salary * sick_Contrib);
		const sumZus = Number(penContrib + disContrib + sickContrib);
		const hiPremium = Number((parseFloat(gross_salary) - sumZus) * hIpremium).toFixed(2);
		const income = parseFloat(gross_salary - sumZus - costs_of_income);
		netSalary = parseFloat((gross_salary - sumZus - parseFloat(hiPremium)).toFixed(2));
		const basisOfhInsurance = gross_salary - sumZus;
		// obliczenia ze składkami PPK
		if (ppkChecked) {
			const ppkemployee = Number(gross_salary * finemployee);
			netSalary = parseFloat((gross_salary - sumZus - finemployee - parseFloat(hiPremium)).toFixed(2));
			const ppkSum = Number(Number(financedemployer) + ppkemployee);
			const calcresults = {
				description: description,
				grossSalary: parseFloat(gross_salary),
				tax_reduction,
				penContrib,
				disContrib,
				sickContrib,
				sumZus,
				hiPremium: Number(hiPremium),
				costs_of_income: costs_of_income,
				basisOfTaxPaym: 0,
				advPayment: 0,
				tax_reduction: 0,
				tax_advance: 0,
				netSalary,
				basisOfhInsurance,
				financedemployer,
				ppkemployee,
				netSalary,
				ppkSum,
			};
			token = jwt.sign({ calcresults }, SECRET_KEY, { expiresIn: '1h' });
			return res.json({ token });
		} else if (ppkChecked === false) {
			//pracownik < 26 r.ż bez składek PPK
			const calcresults = {
				description: description,
				grossSalary: parseFloat(gross_salary),
				tax_reduction,
				penContrib,
				disContrib,
				sickContrib,
				sumZus,
				hiPremium: Number(hiPremium),
				costs_of_income: costs_of_income,
				basisOfTaxPaym: 0,
				advPayment: 0,
				tax_reduction: 0,
				tax_advance: 0,
				netSalary,
				basisOfhInsurance,
				financedbyemployee: null,
				financedemployer: null,
				ppkSum: null,
			};
			token = jwt.sign({ calcresults }, SECRET_KEY, { expiresIn: '1h' });
			return res.json({ token });
		}
	} else if (disableSelects == false) {
		//pracownik > 26 r.ż.
		const penContrib = parseFloat((gross_salary * pen_Contrib).toFixed(2));
		const disContrib = parseFloat(gross_salary * dis_Contrib);
		const sickContrib = parseFloat(gross_salary * sick_Contrib);
		const sumZus = parseFloat(gross_salary * 0.1371);
		const hiPremium = Number((gross_salary - sumZus) * hIpremium).toFixed(2);
		const income = parseFloat(gross_salary - sumZus - costs_of_income);
		const basisOfTaxPaym = Math.round(parseFloat(gross_salary - sumZus - costs_of_income));
		const basisOfhInsurance = gross_salary - sumZus;
		const advPayment = Number(basisOfTaxPaym * tax_advance - tax_reduction).toFixed(2) < 0 ? 0 : Number(basisOfTaxPaym * tax_advance - tax_reduction).toFixed(2);
		netSalary = parseFloat((gross_salary - sumZus - advPayment - costs_of_income).toFixed(3));
		//wynagrodzenie ze składkami PPK
		if (ppkChecked) {
			const finemployee = Number(financedbyemployee / 100);
			const ppkemployee = parseFloat(gross_salary * finemployee);
			const advPayment = parseFloat(basisOfTaxPaym * tax_advance - tax_reduction) < 0 ? 0 : parseFloat(basisOfTaxPaym * tax_advance - tax_reduction).toFixed(2);
			netSalary = parseFloat((gross_salary - sumZus - advPayment - costs_of_income - gross_salary * finemployee).toFixed(2));
			const ppkSum = Number(financedemployer) + Number(ppkemployee);

			const calcresults = {
				description: description,
				grossSalary: parseFloat(gross_salary),
				tax_reduction,
				penContrib,
				disContrib,
				sickContrib,
				sumZus,
				hiPremium: Number(hiPremium),
				costs_of_income,
				basisOfTaxPaym,
				basisOfhInsurance,
				advPayment,
				financedemployer: Number(financedemployer),
				ppkemployee: Number(ppkemployee),
				netSalary,
				ppkSum: Number(ppkSum),
			};
			token = jwt.sign({ calcresults }, SECRET_KEY, { expiresIn: '1h' });
			return res.json({ token });
		} else if (ppkChecked === false) {
			//wynagrodzenie bez składek PPK
			const advPayment = Number(basisOfTaxPaym * tax_advance - tax_reduction) < 0 ? 0 : Number(basisOfTaxPaym * tax_advance - tax_reduction).toFixed(2);
			const calcresults = {
				description: description,
				grossSalary: parseFloat(gross_salary),
				tax_reduction,
				penContrib,
				disContrib,
				sickContrib,
				sumZus,
				hiPremium: Number(hiPremium),
				costs_of_income,
				basisOfTaxPaym,
				basisOfhInsurance,
				advPayment: advPayment,
				netSalary,
				financedbyemployee: null,
				financedemployer: null,
				ppkSum: null,
			};

			token = jwt.sign({ calcresults }, SECRET_KEY, { expiresIn: '1h' });
			return res.json({ token });
		}
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
