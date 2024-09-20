('use strict');

const isU26Used = localStorage.getItem('isU26Used');
const isCalcResult = localStorage.getItem('isCalcResult');
const btnPrevSite = document.querySelector('.btn_prev_site');
const backBtn = document.querySelector('.back-btn');
const dropList = document.querySelector('.dropdown');
const refferer = document.refferer;
const ppkTrue = sessionStorage.getItem('ppkChecked');

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
				console.log(calcresults);
				localStorage.setItem('calcresults.description', calcresults.description);
				document.getElementById('gross-value').value = calcresults.grossSalary;
				document.querySelector('.tax-red-val').value = calcresults.tax_reduction;
				document.querySelector('.pension-contrib-val').value = calcresults.penContrib.toFixed(2);
				document.querySelector('.pension-contrib-sec-val').value = calcresults.disContrib;
				document.querySelector('.sickness-contrib-val').value = calcresults.sickContrib.toFixed(2);
				document.querySelector('.zus-contrib-sum-val').value = calcresults.sumZus;
				document.querySelector('.basis-of-h-insurance-val').value = calcresults.basisOfhInsurance;
				document.querySelector('.h-i-premium-val').value = calcresults.hiPremium;
				document.querySelector('.costs-of-income-val').value = calcresults.costs_of_income;
				document.querySelector('.basis-of-adv-val').value = calcresults.basisOfTaxPaym;
				document.querySelector('.adv-tax-office-val').value = calcresults.advPayment < 0 ? 0 : Math.round(calcresults.advPayment);
				document.querySelector('.adv-tax-paym-val').value = calcresults.advPayment < 0 ? 0 : calcresults.advPayment.toFixed(2);
				document.querySelector('.ppk_employee').value = calcresults.ppkemployee == null ? 0 : calcresults.ppkemployee;
				document.querySelector('.ppk_employer').value = calcresults.financedemployer == null ? 0 : calcresults.financedemployer;
				document.querySelector('.ppk_sum_value').value = calcresults.ppkSum == null ? 0 : calcresults.ppkSum;
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

			localStorage.setItem('calcsU26.description', calcsU26.description);
			document.getElementById('gross-value').value = calcsU26.grossSalary;
			document.querySelector('.tax-red-val').value = calcsU26.tax_reduction;
			document.querySelector('.pension-contrib-val').value = calcsU26.penContrib.toFixed(2);
			document.querySelector('.pension-contrib-sec-val').value = calcsU26.disContrib;
			document.querySelector('.sickness-contrib-val').value = calcsU26.sickContrib;
			document.querySelector('.zus-contrib-sum-val').value = calcsU26.sumZus.toFixed(2);
			document.querySelector('.h-i-premium-val').value = calcsU26.hiPremium;
			document.querySelector('.costs-of-income-val').value = calcsU26.costs_of_income;
			document.querySelector('.basis-of-adv-val').value = calcsU26.basisOfTaxPaym.toFixed(2);
			document.querySelector('.adv-tax-paym-val').value = calcsU26.advPayment.toFixed(2);
			document.querySelector('.to-be-paid-val').value = calcsU26.netSalary;
			document.querySelector('.basis-of-h-insurance-val').value = calcsU26.basisOfhInsurance == 0 ? 0 : calcsU26.basisOfhInsurance;
			document.querySelector('.ppk_employee').value = 0;
			document.querySelector('.ppk_employer').value = 0;
			document.querySelector('.ppk_sum_value').value = 0;

			// Zapisz dodatkowe informacje w localStorage
			localStorage.setItem('calcsU26.description', calcsU26.description);
			return calcsU26;
		} catch (error) {
			console.error('Błąd', error);
		}
	});
}

btnPrevSite.addEventListener('click', function () {
	if (refferer.includes('/main-calc')) {
		window.location.href = '/main-calc';
	} else if (refferer.includes('/calc-order')) {
		window.location.href = '/calc-order';
	}
});
