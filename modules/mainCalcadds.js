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

const checkboxEl = document.getElementById('check-yes');

checkboxEl.addEventListener('change', function () {
	if (checkboxEl.checked) {
		showDivPpk();
	} else {
		hideDivppk();
	}
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

function showToolTip() {
	tooltipdescr.classList.remove('hidden');
}

function hideToolTip() {
	tooltipdescr.classList.add('hidden');
}

document.getElementById('description').addEventListener('mouseover', showToolTip);
document.getElementById('description').addEventListener('mouseleave', hideToolTip);

btnBack.addEventListener('click', function () {
	window.location.href = '/buttons';
});

btnReset.addEventListener('click', function (e) {
	e.preventDefault();
	location.reload();
});
