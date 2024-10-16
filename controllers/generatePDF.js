const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const datetime = new Date();
const logger = require('./logger');

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
			logger.error('Błąd pobierania danych z serwera:', error);
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
			logger.error('Błąd pobierania wyników obliczeń:', error);
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
		doc.y = 8;

		const toNumberOrZero = value => {
			if (value === null || value === undefined) {
				return 0;
			}
			const num = parseFloat(value);
			return isNaN(num) ? 0 : num;
		};

		doc.fillColor('black');
		doc.lineGap(5);
		doc.fontSize(16);
		doc.text('Wyniki Twoich obliczeń:', { underline: true, align: 'center' });
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
		doc.text(`Do wyplaty: ${dataToUse.netSalary} zl`, { underline: true });
		doc.moveDown();
		doc.moveDown();
		doc.moveDown();
		doc.moveDown();
		doc.moveDown();
		doc.moveDown();
		doc.moveDown();
		doc.moveDown();
		doc.fontSize(16);
		doc.text('Wpłaty PPK :', { underline: true, align: 'center' });
		doc.moveDown();
		doc.fontSize(14).text(`Wpłata pracodawcy: ${toNumberOrZero(dataToUse.financedemployer)} zł`);
		doc.moveDown();
		doc.text(`Wpłata pracownika: ${toNumberOrZero(dataToUse.ppkemployee)} zł`);
		doc.moveDown();
		doc.text(`Suma wpłat: ${toNumberOrZero(dataToUse.ppkSum)} zł`);
		doc.moveDown();
		doc.moveDown();
		doc.fontSize(12);
		doc.text('*Wygenerowano przy użyciu Polish Salary Web Calculator');
		doc.text(`data wykonania: ${datetime.toLocaleString('pl-PL')}`);
		doc.end();

		// Kiedy plik PDF jest już zapisany, wysyłamy go jako odpowiedź
		fileStream.on('finish', () => {
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', 'attachment; filename="wyniki.pdf"');
			res.sendFile(filePath, err => {
				if (err) {
					logger.error('Wystąpił błąd podczas wysyłania pliku:', err);
					res.status(500).send('Błąd pobierania pliku PDF');
				} else {
					logger.info('Plik PDF został wysłany.');

					fs.unlink(filePath, err => {
						if (err) {
							logger.error('Wystąpił błąd:', err);
						} else {
							logger.info('Plik PDF został usunięty z serwera.');
						}
					});
				}
			});
		});
	} catch (error) {
		logger.error('Wystąpił błąd:', error);
		res.status(500).send('Błąd generowania pliku PDF');
	}
};

module.exports = generatePDF;
