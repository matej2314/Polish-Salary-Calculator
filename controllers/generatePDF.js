const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = async (req, res) => {
	try {
		// Pobieranie danych
		const token = req.headers.authorization.split(' ')[1];
		let calcresults = null;
		let calcsU26 = null;

		try {
			const responseCalcresults = await fetch('http://localhost:8080/calcresult', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (responseCalcresults.ok) {
				calcresults = await responseCalcresults.json();
			}
		} catch (error) {
			console.log('Błąd pobierania danych z serwera:', error);
		}

		try {
			const responseCalcu26 = await fetch('http://localhost:8080/calcu26', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (responseCalcu26.ok) {
				calcsU26 = await responseCalcu26.text();
			}
		} catch (error) {
			console.log('Błąd pobierania wyników obliczeń:', error);
		}

		const dataToUse = calcsU26 || calcresults;

		if (!dataToUse) {
			throw new Error('Nie udało się pobrać żadnych wyników obliczeń :(');
		}
		// Generowanie PDF
		const doc = new PDFDocument();
		const filePath = path.join(__dirname, 'wyniki.pdf');
		const fileStream = fs.createWriteStream(filePath);
		doc.pipe(fileStream);

		doc.font(path.join(__dirname, '../fonts', 'Roboto-Regular.ttf'));

		doc.rect(0, 0, doc.page.width, doc.page.height).fill('whitesmoke');

		doc.fillColor('black');

		doc.fontSize(16).text('Wyniki Twoich obliczeń:', { align: 'center' });
		doc.moveDown();
		doc.fontSize(14).text(`Wynagrodzenie brutto: ${dataToUse.grossSalary} zl`);
		doc.moveDown();
		doc.text(`Wartosc ulgi podatkowej: ${dataToUse.tax_reduction} zl`);
		doc.moveDown();
		doc.text(`Skladka emerytalna: ${dataToUse.penContrib} zl`);
		doc.moveDown();
		doc.text(`Skladka rentowa: ${dataToUse.disContrib} zl`);
		doc.moveDown();
		doc.text(`Skladka chorobowa: ${dataToUse.sickContrib} zl`);
		doc.moveDown();
		doc.text(`Suma skladek ZUS: ${dataToUse.sumZus} zl`);
		doc.moveDown();
		doc.text(`Podstawa obliczenia skladek: ${dataToUse.grossSalary * 0.1371} zl`);
		doc.moveDown();
		doc.text(`Skladka zdrowotna: ${dataToUse.hiPremium} zl`);
		doc.moveDown();
		doc.text(`Koszty uzyskania przychodu: ${dataToUse.costs_of_income} zł`);
		doc.moveDown();
		doc.text(`Podstawa zaliczki na podatek: ${dataToUse.basisOfTaxPaym} zl`);
		doc.moveDown();
		doc.text(`Zaliczka na podatek: ${dataToUse.advPayment} zl`);
		doc.moveDown();
		doc.text(`Do wyplaty: ${dataToUse.netSalary} zl`);

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
