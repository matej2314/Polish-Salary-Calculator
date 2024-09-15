'use strict';
import { adjustSelectWidth } from '../modules/functions';

document.addEventListener('DOMContentLoaded', function () {
	if (sessionStorage.getItem('sixthBtnClicked') === 'true') {
		document.getElementById('advance-tax-paym-val').disabled = true;
		document.getElementById('tax-reduction-val').disabled = true;
		document.getElementById('calc-contributions-val').disabled = true;
	}
	if (sessionStorage.getItem('studStatus') === 'true') {
		document.getElementById('advance-tax-paym-val').disabled = true;
		document.getElementById('tax-reduction-val').disabled = true;
		document.getElementById('cost-of-income-val').disabled = true;
	}
});

const modalSelect = document.getElementById('calc-contributions-val');
const modalEl = document.querySelector('.modal_question');
const mainCont = document.querySelector('.calc-order-container');
const grossSal = document.getElementById('gross-salary');
const btnCalc = document.querySelector('.btn-calc-cont');
const btnYes = document.querySelector('.btn-yes');
const btnNo = document.querySelector('.btn-no');

btnYes.addEventListener('click', function () {
	modalSelect.setAttribute('disabled', 'disabled');
	mainCont.classList.remove('hidden');
	modalEl.classList.add('hidden');
});

btnNo.addEventListener('click', function () {
	mainCont.classList.remove('hidden');
	modalEl.classList.add('hidden');
});

adjustSelectWidth();

document.querySelectorAll('select').forEach(selectElement => {
	adjustSelectWidth(selectElement);
	selectElement.addEventListener('change', () => adjustSelectWidth(selectElement));
});

btnCalc.addEventListener('click', function (e) {
	const value = grossSal.value.trim();
	if (!/^\d+(\.\d{1,2})?$/.test(value)) {
		alert('Wprowadź wyłącznie wartości liczbowe! ( kwota brutto )');
	}
});

const prepareData = () => {
	const descvalue = document.getElementById('description').value;
	const grossSalary = parseFloat(document.getElementById('gross-salary').value).toFixed(2);
	const costsofIncome = Number(parseFloat(document.getElementById('cost-of-income-val').value).toFixed(2));
	const taxAdvanceElement = document.getElementById('advance-tax-paym-val');
	const taxAdvance = taxAdvanceElement.value === '0' ? 0 : parseFloat(taxAdvanceElement.value).toFixed(2);
	const taxRedElement = document.getElementById('tax-reduction-val');
	const taxRed = taxRedElement.value === '0' ? 0 : parseFloat(taxRedElement.value);
	const calcContributions = document.getElementById('calc-contributions-val').value;

	const studStatus = sessionStorage.getItem('studStatus') === 'true';
	const sixthBtnClicked = sessionStorage.getItem('sixthBtnClicked') === 'true';

	return {
		description: descvalue,
		gross_salary: parseFloat(grossSalary),
		costs_of_income: costsofIncome,
		tax_advance: parseFloat(taxAdvance),
		tax_reduction: parseFloat(taxRed),
		calcContributions: calcContributions,
		studStatus: studStatus,
		sixthBtnClicked: sixthBtnClicked,
	};
};

const sendData = async data => {
	try {
		const response = await fetch('/calcu26', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (response.ok) {
			const responseData = await response.json();
			console.log('Dane wysłane', responseData);
			const { token } = responseData;
			localStorage.setItem('token', token);
			window.location.href = '/results';
		} else {
			console.log('Błąd odpowiedzi', response.status);
		}
	} catch (error) {
		console.log('Wystąpił błąd:', error);
	}
};

btnCalc.addEventListener('click', async function (e) {
	e.preventDefault();
	const data = prepareData();
	await sendData(data);
	localStorage.setItem('isU26Used', 'true');
});
