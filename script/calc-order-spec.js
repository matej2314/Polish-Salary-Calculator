'use strict';

document.addEventListener('DOMContentLoaded', function () {
	// Obsługa stanu przycisków w zależności od sesji
	const handleSessionState = () => {
		if (sessionStorage.getItem('sixthBtnClicked') === 'true') {
			disableElements(['advance-tax-paym-val', 'tax-reduction-val']);
		} else if (sessionStorage.getItem('studStatus') === 'true') {
			disableElements(['advance-tax-paym-val', 'tax-reduction-val', 'cost-of-income-val']);
		} else if (sessionStorage.getItem('fifthBtnClicked') === 'true') {
			enableElements(['advance-tax-paym-val', 'tax-reduction-val', 'cost-of-income-val']);
		}
	};

	const disableElements = elementIds => {
		elementIds.forEach(id => (document.getElementById(id).disabled = true));
	};

	const enableElements = elementIds => {
		elementIds.forEach(id => (document.getElementById(id).disabled = false));
	};

	handleSessionState();
});

// Zmienne globalne
const modalSelect = document.getElementById('calc-contributions-val');
const modalEl = document.querySelector('.modal_question');
const mainCont = document.querySelector('.calc-order-container');
const grossSal = document.getElementById('gross-salary');
const btnCalc = document.querySelector('.btn-calc-cont');
const btnYes = document.querySelector('.btn-yes');
const btnNo = document.querySelector('.btn-no');

// Obsługa przycisków modalnych
btnYes.addEventListener('click', function () {
	modalSelect.setAttribute('disabled', 'disabled');
	mainCont.classList.remove('hidden');
	modalEl.classList.add('hidden');
});

btnNo.addEventListener('click', function () {
	mainCont.classList.remove('hidden');
	modalEl.classList.add('hidden');
});

// Funkcja do dostosowywania szerokości selecta
const adjustSelectWidth = selectElement => {
	const tempDiv = document.createElement('div');
	document.body.appendChild(tempDiv);

	const computedStyle = window.getComputedStyle(selectElement);
	Object.assign(tempDiv.style, {
		fontSize: computedStyle.fontSize,
		fontFamily: computedStyle.fontFamily,
		fontWeight: computedStyle.fontWeight,
		letterSpacing: computedStyle.letterSpacing,
		whiteSpace: 'nowrap',
		position: 'absolute',
		top: '-9999px',
	});

	tempDiv.textContent = selectElement.options[selectElement.selectedIndex].text;
	selectElement.style.width = `${tempDiv.offsetWidth + 35}px`;

	document.body.removeChild(tempDiv);
};

// Obsługa wszystkich selectów
document.querySelectorAll('select').forEach(selectElement => {
	adjustSelectWidth(selectElement);
	selectElement.addEventListener('change', () => adjustSelectWidth(selectElement));
});

// Walidacja kwoty brutto przed przekierowaniem
btnCalc.addEventListener('click', function (e) {
	const value = grossSal.value.trim();
	if (!/^\d+(\.\d{1,2})?$/.test(value)) {
		alert('Wprowadź wyłącznie wartości liczbowe! ( kwota brutto )');
	}
});

// Funkcja przygotowująca dane do wysłania
const prepareData = () => {
	const descvalue = document.getElementById('description').value;
	const grossSalary = parseFloat(document.getElementById('gross-salary').value).toFixed(2); // Używamy toFixed(2) dla formatu
	const costsofIncome = Number(parseFloat(document.getElementById('cost-of-income-val').value).toFixed(2)); // Pobieranie wartości jako liczba
	const taxAdvanceElement = document.getElementById('advance-tax-paym-val');
	const taxAdvance = taxAdvanceElement.value === '0' ? 0 : parseFloat(taxAdvanceElement.value).toFixed(2); // Obsługa wartości '0'
	const taxRedElement = document.getElementById('tax-reduction-val');
	const taxRed = taxRedElement.value === '0' ? 0 : parseFloat(taxRedElement.value); // Obsługa wartości '0'
	const calcContributions = document.getElementById('calc-contributions-val').value; // Wartość tekstowa

	const studStatus = sessionStorage.getItem('studStatus') === 'true';

	return {
		description: descvalue,
		gross_salary: parseFloat(grossSalary), // Konwertujemy na float
		costs_of_income: costsofIncome, // Liczba zmiennoprzecinkowa
		tax_advance: parseFloat(taxAdvance), // Konwertujemy na float
		tax_reduction: parseFloat(taxRed), // Konwertujemy na float
		calcContributions: calcContributions, // Tekstowy wybór
		studStatus: studStatus,
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
			const responseData = await response.json(); // Pobieramy dane JSON z odpowiedzi
			console.log('Dane wysłane', responseData);
			const { token } = responseData; // Odbieramy token z odpowiedzi
			localStorage.setItem('token', token);
			window.location.href = '/results';
		} else {
			console.log('Błąd odpowiedzi', response.status);
		}
	} catch (error) {
		console.log('Wystąpił błąd:', error);
	}
};

// Obsługa kliknięcia przycisku 'btnCalc' po walidacji pól
document.addEventListener('DOMContentLoaded', function () {
	const btnCalc = document.querySelector('.btn-calc');
	btnCalc.addEventListener('click', async function (e) {
		e.preventDefault();
		const data = prepareData(); // Przygotowanie danych
		await sendData(data); // Wysyłanie danych
	});
});
