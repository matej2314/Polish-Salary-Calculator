const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const fetch = require('node-fetch');
const datetime = new Date();

module.exports.generateXLSX = async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	let calcresults = {};
	let calcsU26 = [];

	try {
		const responseCalcresults = await fetch('http://localhost:8080/calcresult', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (responseCalcresults.ok) {
			const text = await responseCalcresults.text();
			calcresults = text ? JSON.parse(text) : {};
		} else {
			console.log('Błąd odpowiedzi z endpointu calcresult:', responseCalcresults.statusText);
		}
	} catch (error) {
		console.log('Wystąpił błąd pobierania danych umowy o pracę', error);
	}

	try {
		const responseCalcu26 = await fetch('http://localhost:8080/calcu26', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (responseCalcu26.ok) {
			const text = await responseCalcu26.text();
			calcsU26 = text ? JSON.parse(text) : {};
		} else {
			console.log('Błąd odpowiedzi z endpointu calcu26:', responseCalcu26.statusText);
		}
	} catch (error) {
		console.log('Błąd pobierania danych umowy o dzieło/zlecenie', error);
	}

	const dataToXLS = calcsU26 && Object.keys(calcsU26).length > 0 ? [calcsU26] : [calcresults];

	if (!dataToXLS || !Array.isArray(dataToXLS) || dataToXLS.length === 0) {
		return res.status(400).json({ Message: 'Brak danych do arkusza' });
	}

	const transformedData = dataToXLS.flatMap(item => {
		return [
			{ Opis: 'Wynagrodzenie brutto', Wartość: `${item.grossSalary || '0'} zł` },
			{ Opis: 'Ulga podatkowa', Wartość: `${item.tax_reduction || '0'} zł` },
			{ Opis: 'Składka emerytalna', Wartość: `${item.penContrib || '0'} zł` },
			{ Opis: 'Składka rentowa', Wartość: `${item.disContrib || '0'} zł` },
			{ Opis: 'Składka chorobowa', Wartość: `${item.sickContrib || '0'} zł` },
			{ Opis: 'Suma składek ZUS', Wartość: `${item.sumZus || '0'} zł` },
			{ Opis: 'Podstawa obliczenia składek', Wartość: `${item.grossSalary * 0.1371 || '0'} zł` },
			{ Opis: 'Składka zdrowotna', Wartość: `${item.hiPremium || '0'} zł` },
			{ Opis: 'Koszty uzyskania przychodu', Wartość: `${item.costs_of_income || '0'} zł` },
			{ Opis: 'Podstawa zaliczki na podatek', Wartość: `${item.basisOfTaxPaym || '0'} zł` },
			{ Opis: 'Zaliczka na podatek', Wartość: `${item.advPayment || '0'} zł` },
			{ Opis: 'Do wypłaty', Wartość: `${item.netSalary || '0'} zł` },
			{ Opis: ' ', Wartość: ` ` },
			{ Opis: 'Wpłata PPK pracodawcy', Wartość: `${item.financedemployer || 0} zł ` },
			{ Opis: 'Wpłata PPK pracownika', Wartość: `${item.ppkemployee || 0} zł ` },
			{ Opis: 'suma wpłat PPK', Wartość: `${item.ppkSum || 0} zł ` },
			{ Opis: ' ', Wartość: ` ` },
			{ Opis: 'Wykonano dnia:', Wartość: `${datetime.toLocaleString('pl-PL')}` },
			{ Opis: ' ', Wartość: ` ` },
			{ Opis: ' ', Wartość: ` ` },
			{ Opis: 'Wygenerowano za pomocą:', Wartość: 'Polish Salary Web Calculator' },
		];
	});

	try {
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(transformedData);
		// Apply the center style to all cells in the worksheet
		const centerStyle = {
			alignment: {
				horizontal: 'center',
				vertical: 'center',
			},
		};

		Object.keys(worksheet).forEach(cell => {
			if (cell.startsWith('A') || cell.startsWith('B')) {
				const cellAddress = XLSX.utils.decode_cell(cell);
				if (!worksheet[cell].s) worksheet[cell].s = {}; // Initialize style if it doesn't exist
				worksheet[cell].s = { ...worksheet[cell].s, ...centerStyle };
			}
		});

		// Adjust column width based on content
		const getMaxLength = data =>
			data.reduce((max, row) => {
				Object.keys(row).forEach(col => {
					const cellValue = row[col] ? row[col].toString() : '';
					max[col] = Math.max(max[col] || 0, cellValue.length);
				});
				return max;
			}, {});

		const maxLength = getMaxLength(transformedData);

		// Define column widths
		worksheet['!cols'] = Object.keys(maxLength).map(col => ({
			wch: maxLength[col] + 2, // Adding a little extra space for padding
		}));

		// Append the worksheet to the workbook
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dane');

		// Write the workbook to a file
		const filePath = path.join(__dirname, 'wyniki.xlsx');
		XLSX.writeFile(workbook, filePath);

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=wyniki.xlsx');

		res.download(filePath, 'wyniki.xlsx', error => {
			if (error) {
				console.log('Błąd wysyłania pliku:', error);
				res.status(500).json({ message: 'Błąd wysyłania pliku' });
			} else {
				fs.unlink(filePath, err => {
					if (err) {
						console.log('Błąd usuwania pliku:', err);
					}
				});
			}
		});
	} catch (error) {
		console.log('Błąd podczas transformacji danych:', error);
		res.status(500).json({ message: 'Błąd transformacji danych' });
	}
};
