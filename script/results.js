('use strict');

const toPercentage = value => {
	return `${(value * 100).toFixed(2)}%`;
};

const isU26Used = localStorage.getItem('isU26Used');
const isCalcResult = localStorage.getItem('isCalcResult');

if (isCalcResult) {
	document.addEventListener('DOMContentLoaded', () => {
		sessionStorage.clear();
		const token = localStorage.getItem('token');

		if (!token) {
			console.error('Błąd uwierzytelniania');
			return;
		}

		fetch('/calcresult', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then(response => {
				if (response.status === 404) {
					throw new Error('Endpoint nie znaleziony');
				}
				if (!response.ok) {
					throw new Error('Błąd pobierania danych');
				}
				return response.json();
			})
			.then(calcresults => {
				localStorage.setItem('calcresults.description', calcresults.description);
				document.getElementById('gross-value').value = calcresults.grossSalary;
				document.querySelector('.tax-red-val').value = calcresults.tax_reduction;
				document.querySelector('.pension-contrib-val').value = calcresults.penContrib;
				document.querySelector('.pension-contrib-sec-val').value = calcresults.disContrib;
				document.querySelector('.sickness-contrib-val').value = calcresults.sickContrib;
				document.querySelector('.zus-contrib-sum-val').value = calcresults.sumZus;
				document.querySelector('.basis-of-h-insurance-val').value = calcresults.grossSalary * 0.1371;
				document.querySelector('.h-i-premium-val').value = Number(calcresults.hiPremium);
				document.querySelector('.costs-of-income-val').value = calcresults.costs_of_income;
				document.querySelector('.basis-of-adv-val').value = calcresults.basisOfTaxPaym;
				document.querySelector('.adv-tax-paym-val').value = calcresults.advPayment;
				document.querySelector('.to-be-paid-val').value = calcresults.netSalary;
			})
			.catch(error => {
				console.error('Wystąpił błąd:', error);
			});
	});
}

let calcsU26Data;

if (isU26Used) {
	document.addEventListener('DOMContentLoaded', async () => {
		sessionStorage.clear();
		const token = localStorage.getItem('token');

		if (!token) {
			console.error('Błąd uwierzytelniania');
			return;
		}

		try {
			const response = await fetch('/calcu26', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 404) {
				throw new Error('Endpoint nie znaleziony');
			}
			if (!response.ok) {
				throw new Error('Błąd pobierania danych');
			}

			const calcsU26 = await response.json();
			console.log(calcsU26);

			// Przypisz dane do zmiennej globalnej
			let calcsU26Data = calcsU26;

			// Manipulacja DOM
			document.getElementById('gross-value').value = calcsU26.grossSalary;
			document.querySelector('.tax-red-val').value = calcsU26.tax_reduction;
			document.querySelector('.pension-contrib-val').value = calcsU26.penContrib.toFixed(2);
			document.querySelector('.pension-contrib-sec-val').value = calcsU26.disContrib;
			document.querySelector('.sickness-contrib-val').value = calcsU26.sickContrib;
			document.querySelector('.zus-contrib-sum-val').value = calcsU26.sumZus.toFixed(2);
			document.querySelector('.h-i-premium-val').value = calcsU26.hiPremium;
			document.querySelector('.costs-of-income-val').value = toPercentage(calcsU26.costs_of_income);
			document.querySelector('.basis-of-adv-val').value = calcsU26.basisOfTaxPaym.toFixed(2);
			document.querySelector('.adv-tax-paym-val').value = calcsU26.advPayment;
			document.querySelector('.to-be-paid-val').value = calcsU26.netSalary;
			document.querySelector('.basis-of-h-insurance-val').value = calcsU26.grossSalary * 0.1371;

			// Zapisz dodatkowe informacje w localStorage
			localStorage.setItem('calcsU26.description', calcsU26.description);
			return calcsU26;
		} catch (error) {
			console.error('Błąd', error);
		}
	});
}

document.querySelector('.btn-pdf').addEventListener('click', async () => {
	try {
		const token = localStorage.getItem('token');

		if (!token) {
			throw new Error('Błąd autoryzacji');
		}

		const response = await fetch('/generate-pdf', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error('Błąd pobierania pliku PDF');
		}

		const blob = await response.blob();

		const url = window.URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'wyniki.pdf';
		document.body.appendChild(a);
		a.click();

		a.remove();

		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.log('Wystąpił błąd podczas pobierania pliku PDF:', error);
	}
});
