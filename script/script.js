('use strict');

document.addEventListener('DOMContentLoaded', function () {
	if (sessionStorage.getItem('disableSelects') === 'true') {
		let reduction = document.getElementById('reduction');
		let taxAdvanceOpts = document.getElementById('tax-advance-opts');

		if (reduction) {
			reduction.disabled = 'disabled';
		}
		if (taxAdvanceOpts) {
			taxAdvanceOpts.disabled = 'disabled';
		}
	}

	if (sessionStorage.getItem('firstBtnClicked') === 'true') {
		let taxAdvanceOpts = document.getElementById('tax-advance-opts');
		let reduction = document.getElementById('reduction');

		if (reduction.disabled) {
			reduction.disabled = false;
		}
		if (taxAdvanceOpts.disabled) {
			taxAdvanceOpts.disabled = false;
		}
	}
});

const selectEl1 = document.getElementById('tax-advance-opts');
const selectEl2 = document.getElementById('dis-contrib-opts');
const selectEl3 = document.getElementById('contrib-opts');
const selectEl4 = document.getElementById('cost-income-opts');
const selectEl5 = document.getElementById('reduction');
const btnBack = document.querySelector('.btn-back');

const checkboxEl = document.getElementById('check-yes');
const btmCalc = document.querySelector('.bottom-of-calc');
const finbyemployer = document.querySelector('.financed-by-employer');
const finbyemployee = document.querySelector('.financed-by-employee');
const finPpkSum = document.querySelector('.financed-ppk-sum');
const btnReset = document.querySelector('.btn-clear-calc');
const calcCont = document.querySelector('.calc-container');
const btnCalc = document.querySelector('.btn-calc');
const grossSal = document.getElementById('gross-salary');
const tooltipdescr = document.querySelector('.tooltip-descr');
const tooltiptext = document.querySelector('.tooltip-descr-text');

const tableEl = [selectEl1, selectEl2, selectEl3, selectEl4, selectEl5];

function adjustSelectWidthOnChange(selectElement) {
	const widthHelper = document.createElement('span');
	widthHelper.style.position = 'absolute';
	widthHelper.style.visibility = 'hidden';
	widthHelper.style.whiteSpace = 'nowrap';
	document.body.appendChild(widthHelper);

	const selectedOption = selectElement.options[selectElement.selectedIndex];
	widthHelper.textContent = selectedOption.text;
	const selectedWidth = widthHelper.offsetWidth;

	selectElement.style.width = `${selectedWidth + 26}px`;

	document.body.removeChild(widthHelper);
}

window.addEventListener('DOMContentLoaded', function () {
	const selectElements = [...tableEl];
	selectElements.forEach(selectElement => {
		adjustSelectWidthOnChange(selectElement); // Dostosowanie szerokości na początku

		selectElement.addEventListener('change', function () {
			adjustSelectWidthOnChange(selectElement); // Dostosowanie szerokości po zmianie
		});
	});
});

checkboxEl.addEventListener('change', function () {
	if (checkboxEl.checked) {
		showDivPpk();
	} else {
		hideDivppk();
	}
});

btnBack.addEventListener('click', function () {
	window.location.href = '/buttons';
});

function showDivPpk() {
	btmCalc.style.top = '0';
	finPpkSum.classList.remove('hidden');
	finbyemployee.classList.remove('hidden');
	finbyemployer.classList.remove('hidden');
	tooltiptext.style.bottom = '268px';
	document.querySelector('.arrow-left').style.top = '-270px';
	document.querySelector('.line1').classList.remove('hidden');
	document.querySelector('.line2').classList.remove('hidden');
	document.querySelector('.line3').classList.remove('hidden');
	calcCont.style.height = 'fit-content';
}

function hideDivppk() {
	btmCalc.style.top = '-135px';
	finPpkSum.classList.add('hidden');
	finbyemployee.classList.add('hidden');
	finbyemployer.classList.add('hidden');
	document.querySelector('.line1').classList.add('hidden');
	document.querySelector('.line2').classList.add('hidden');
	document.querySelector('.line3').classList.add('hidden');
	calcCont.style.height = '78vh';
	tooltiptext.style.bottom = '208px';
	document.querySelector('.arrow-left').style.top = '-210px';
}

btnReset.addEventListener('click', function (e) {
	e.preventDefault();
	location.reload();
});

btnCalc.addEventListener('click', function () {
	const value = grossSal.value.trim();
	if (!/^\d+(\.\d+)?$/.test(value)) {
		alert('Wprowadź wyłącznie wartości liczbowe! ( kwota brutto )');
	} else {
		console.log('wartość poprawna');
	}
});

function showToolTip() {
	tooltipdescr.classList.remove('hidden');
}

function hideToolTip() {
	tooltipdescr.classList.add('hidden');
}

document.getElementById('description').addEventListener('mouseover', showToolTip);
document.getElementById('description').addEventListener('mouseleave', hideToolTip);

btnCalc.addEventListener('click', async e => {
	e.preventDefault();
	if (!checkboxEl.checked) {
		const descvalue = document.getElementById('description').value;
		const grosSSalary = parseInt(grossSal.value).toFixed(2);
		const taxRed = parseFloat(document.getElementById('reduction').value);
		const penContrib = parseFloat(document.getElementById('contrib-opts').value).toFixed(2);
		const disContrib = parseFloat(document.getElementById('dis-contrib-opts').value).toFixed(2);
		const sickContrib = (parseFloat(document.querySelector('.sick-contrib-val').value) / 100).toFixed(2);
		const hIpremium = Number(parseFloat(document.getElementById('h-i-val').value) / 100).toFixed(2);
		const costsofIncome = Number(parseFloat(document.getElementById('cost-income-opts').value));
		const taxAdvance = parseFloat(document.getElementById('tax-advance-opts').value).toFixed(2);
		const financedemployer = document.getElementById('financed-by-employer').value;
		const financedbyemployee = document.getElementById('financed-by-employee').value;
		const disableSelects = sessionStorage.getItem('disableSelects') === 'true';
		const firstBtnClicked = sessionStorage.getItem('firstBtnClicked') === 'true';

		const calcData = {
			description: descvalue,
			gross_salary: grosSSalary,
			tax_reduction: taxRed,
			pen_Contrib: penContrib,
			dis_Contrib: disContrib,
			sick_Contrib: sickContrib,
			hIpremium: hIpremium,
			costs_of_income: costsofIncome,
			tax_advance: taxAdvance,
			disableSelects: disableSelects,
			financedemployer: financedemployer,
			financedbyemployee: financedbyemployee,
		};

		try {
			const response = await fetch('/calcresult', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(calcData),
			});

			if (response.ok) {
				const responseData = await response.json();
				console.log('Dane wysłane', responseData);
				const { token } = responseData;
				localStorage.setItem('token', token);
				localStorage.setItem('isCalcResult', 'true');
				window.location.href = '/results.html';
			} else {
				console.log('Błąd odpowiedzi', response.status);
			}
		} catch (error) {
			console.log(error);
		}
	}
});
