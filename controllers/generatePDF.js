const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = async (req, res) => {
	try {
		// Pobieranie danych
		const token = req.headers.authorization.split(' ')[1];
		const response = await fetch('http://localhost:8080/calcresult', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error('Błąd pobierania danych');
		}

		const calcresults = await response.json();

		// Generowanie PDF
		const doc = new PDFDocument();
		const filePath = path.join(__dirname, 'wyniki.pdf');
		const fileStream = fs.createWriteStream(filePath);
		doc.pipe(fileStream);

		doc.font(path.join(__dirname, '../fonts', 'Roboto-Regular.ttf'));

		doc.rect(0, 0, doc.page.width, doc.page.height).fill('whitesmoke');

		doc.fillColor('black');

		doc.fontSize(16).text('Wyniki Twoich obliczen:', { align: 'center' });

		doc.moveDown();
		doc.fontSize(14).text(`Wynagrodzenie brutto: ${calcresults.grossSalary} zl`);
		doc.moveDown();
		doc.text(`Wartosc ulgi podatkowej: ${calcresults.tax_reduction} zl`);
		doc.moveDown();
		doc.text(`Skladka emerytalna: ${calcresults.penContrib} zl`);
		doc.moveDown();
		doc.text(`Skladka rentowa: ${calcresults.disContrib} zl`);
		doc.moveDown();
		doc.text(`Skladka chorobowa: ${calcresults.sickContrib} zl`);
		doc.moveDown();
		doc.text(`Suma skladek ZUS: ${calcresults.sumZus} zl`);
		doc.moveDown();
		doc.text(`Podstawa obliczenia skladek: ${calcresults.grossSalary * 0.1371} zl`);
		doc.moveDown();
		doc.text(`Skladka zdrowotna: ${calcresults.hiPremium} zl`);
		doc.moveDown();
		doc.text(`Koszty uzyskania przychodu: ${calcresults.costs_of_income} zl`);
		doc.moveDown();
		doc.text(`Podstawa zaliczki na podatek: ${calcresults.basisOfTaxPaym} zl`);
		doc.moveDown();
		doc.text(`Zaliczka na podatek: ${calcresults.advPayment} zl`);
		doc.moveDown();
		doc.text(`Do wyplaty: ${calcresults.netSalary} zl`);

		doc.end();

		// Kiedy plik PDF jest już zapisany, wysyłamy go jako odpowiedź
		fileStream.on('finish', () => {
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', 'attachment; filename="wyniki.pdf"');
			res.sendFile(filePath, err => {
				if (err) {
					console.log('Wystąpił błąd podczas wysyłania pliku:', err);
					res.status(500).send('Błąd pobierania pliku PDF');
				} else {
					console.log('Plik PDF został wysłany.');

					fs.unlink(filePath, err => {
						if (err) {
							console.log('Wystąpił błąd:', err);
						} else {
							console.log('Plik PDF został usunięty z serwera.');
						}
					});
				}
			});
		});
	} catch (error) {
		console.log('Wystąpił błąd:', error);
		res.status(500).send('Błąd generowania pliku PDF');
	}
};

module.exports = generatePDF;
