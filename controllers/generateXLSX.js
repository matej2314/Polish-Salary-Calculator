const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

export const generateXLSX = async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	const calcresults = null;
	const calcsU26 = null;

	try {
		const responseCalcresults = await fetch('http://localhost:8080/calcresult', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (responseCalcresults) {
			calcresults = await responseCalcresults.json();
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
			calcsU26 = await responseCalcu26.json();
		}
	} catch (error) {
		console.log('Błąd pobierania danych umowy o dzieło/zlecenie', error);
	}

	const dataToXLS = responseCalcu26 || responseCalcresults;

	if (!dataToXLS) {
		throw new Error('Brak danych do arkusza!');
	}

	const transformedData = dataToXLS.map(item => {
		return {
			'Wynagrodzenie brutto': item.grossSalary,
			'Ulga podatkowa': item.tax_reduction,
			'Składka emerytalna': item.penContrib,
		};
	});

	const workbook = XLSX.utils.book_new();
	const worksheet = XLSX.utils.json_to_sheet(transformedData);

	XLSX.utils.book_append_sheet(workbook, worksheet, 'Dane');

	const filePath = path.join(__dirname, 'wyniki.xlsx');
	XLSX.writeFile(workbook, filePath);

	res.download(filePath, 'wyniki.xlsx', error => {
		if (error) {
			console.log('Błąd wysyłania pliku:', error);
			res.status(500).json({ message: 'Błąd wysyłania pliku' });
		}

		fs.unlinkSync(filePath);
	});
};
