const firstBtn = document.querySelector('.first-btn-yes');
const secondBtn = document.querySelector('.first-btn-no');
const thirdBtn = document.querySelector('.second-btn-yes');
const fourthBtn = document.querySelector('.second-btn-no');

const eighthBtn = document.querySelector('.first-btn-order-no');
const ninethBtn = document.querySelector('.second-btn-order-no');
const tenthBtn = document.querySelector('.second-btn-order-yes');
const eleventhBtn = document.querySelector('.third-btn-order-yes');
const twelvethBtn = document.querySelector('.third-btn-order-no');

const btnsContainer = document.querySelector('.btns-container');
const orderBtn = document.querySelector('.btn-order');
const contractBtn = document.querySelector('.btn-contr');
const specWrkBtn = document.querySelector('.btn-specwrk');
const modal1El = document.querySelector('.modal-questions');
const modal2El = document.querySelector('.modal-questions-order');

export const btnsClickEvents = () => {
	secondBtn.addEventListener('click', function () {
		sessionStorage.setItem('disableSelects', 'true');
	});

	firstBtn.addEventListener('click', function () {
		sessionStorage.setItem('firstBtnClicked', 'true');
	});

	eighthBtn.addEventListener('click', function () {
		sessionStorage.setItem('sixthBtnClicked', 'true');
	});

	tenthBtn.addEventListener('click', function () {
		sessionStorage.setItem('studStatus', 'true');
	});

	ninethBtn.addEventListener('click', function () {
		sessionStorage.setItem('fifthBtnClicked', 'true');
	});

	fourthBtn.addEventListener('click', function () {
		document.querySelector('.empl-container').style.opacity = '1';
		document.getElementById('wkrplcs-count').disabled = false;
	});

	thirdBtn.addEventListener('click', function () {
		document.querySelector('.empl-container').style.opacity = '0.5';
		document.getElementById('wkrplcs-count').disabled = true;
	});

	twelvethBtn.addEventListener('click', function () {
		document.querySelector('.empl-container-order').style.opacity = '1';
		document.getElementById('wkrplcs-count-order').disabled = false;
	});

	eleventhBtn.addEventListener('click', function () {
		document.querySelector('.empl-container-order').style.opacity = '0.5';
		document.getElementById('wkrplcs-count-order').disabled = true;
	});

	contractBtn.addEventListener('click', function () {
		btnsContainer.classList.toggle('hidden');
		modal1El.classList.toggle('hidden');
	});
	orderBtn.addEventListener('click', function () {
		btnsContainer.classList.toggle('hidden');
		modal2El.classList.toggle('hidden');
	});
	specWrkBtn.addEventListener('click', function () {
		sessionStorage.setItem('SpecWrk', 'true');
		window.location.href = '/calc-order';
	});
};
