const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

module.exports.generatePDF = async (req, res) => {
	try {
		const response = await fetch('/calcresult', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) {
			throw new Error('Błąd pobierania danych');
		}
		const calcresults = await response.json();

		const doc = new PDFDocument();

		const filePath = path.join(__dirname, 'wyniki.pdf');
		doc.pipe(fs.createWriteStream(filePath));

		doc.fontSize(16).text('Wyniki Twoich obliczeń:', {
			align: 'center',
		});

		doc.moveDown();

		doc.fontSize(14).text(`Wynagrodzenie brutto: ${calcresults.grossSalary}`);
		doc.text(`Wartość ulgi podatkowej: ${calcresults.tax_reduction}`);
		doc.text(`Składka emerytalna: ${calcresults.penContrib}`);
		doc.text(`Składka rentowa: ${calcresults.disContrib}`);
		doc.text(`Składka chorobowa: ${calcresults.sickContrib}`);
		doc.text(`Suma składek ZUS: ${calcresults.sumZus}`);
		doc.text(`Podstawa obliczenia składek: ${grossSalary * 0.1371}`);
		doc.text(`Składka zdrowotna: ${calcresults.hiPremium}`);
		doc.text(`Koszty uzyskania przychodu: ${calcresults.costs_of_income}`);
		doc.text(`Podstawa zaliczki na podatek: ${calcresults.basisOfTaxPaym}`);
		doc.text(`Zaliczka na podatek: ${calcresults.advPayment}`);
		doc.text(`Do wypłaty: ${calcresults.netSalary}`);

		doc.end();

		res.sendFile(filePath);
	} catch (error) {
		console.log('Wystąpił błąd:', error);
		res.status(500), send('Błąd generowania pliku PDF');
	}
};
