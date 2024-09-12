'use strict';

const btnsAll = document.querySelectorAll('.btn');
const btnsContainer = document.querySelector('.btns-container');
const orderBtn = document.querySelector('.btn-order');
const contractBtn = document.querySelector('.btn-contr');
const specWrkBtn = document.querySelector('.btn-specwrk');
const modal1El = document.querySelector('.modal-questions');
const modal2El = document.querySelector('.modal-questions-order');
const imgEl = document.querySelector('.info-sign');
const tooltip = document.querySelector('.tooltip-text');

contractBtn.addEventListener('click', function () {
	document.querySelector('.btns-container').classList.toggle('hidden');
	modal1El.classList.toggle('hidden');
});
orderBtn.addEventListener('click', function () {
	btnsContainer.classList.toggle('hidden');
	modal2El.classList.toggle('hidden');
});
specWrkBtn.addEventListener('click', function () {
	btnsContainer.classList.toggle('hidden');
	modal2El.classList.toggle('hidden');
});

const firstBtn = document.querySelector('.first-btn-no');
const secondBtn = document.querySelector('.second-btn-yes');
const thirdBtn = document.querySelector('.second-btn-no');
const fourthBtn = document.querySelector('.third-btn-yes');

const fifthBtn = document.querySelector('.first-btn-order-yes');
const sixthBtn = document.querySelector('.first-btn-order-no');
const eigthBtn = document.querySelector('.second-btn-order-no');
const seventhBtn = document.querySelector('.second-btn-order-yes');
const ninethhBtn = document.querySelector('.third-btn-order-yes');
const tenthBtn = document.querySelector('.third-btn-order-no');
const eleventhBtn = document.querySelector('.third-btn-order-nd');

document.querySelector('.first-btn-yes').addEventListener('click', function () {
	sessionStorage.setItem('firstBtnClicked', 'true');
});

firstBtn.addEventListener('click', function () {
	sessionStorage.setItem('disableSelects', 'true');
	window.location.href = '/main-calc';
});

sixthBtn.addEventListener('click', function () {
	sessionStorage.setItem('sixthBtnClicked', 'true');
	window.location.href = '/calc-order';
});
seventhBtn.addEventListener('click', function () {
	sessionStorage.setItem('studStatus', 'true');
	window.location.href = '/calc-order';
});

fifthBtn.addEventListener('click', function () {
	sessionStorage.setItem('fifthBtnClicked', 'true');
	window.location.href = '/calc-order';
});

// const btnsElements = [secondBtn, thirdBtn, fourthBtn, sixthBtn, eigthBtn, ninethhBtn, tenthBtn, eleventhBtn];

// btnsElements.forEach(button => {
// 	button.addEventListener('click', function () {
// 		button.classList.toggle('clicked');
// 	});
// });

imgEl.addEventListener('mouseover', event => {
	tooltip.style.visibility = 'visible';
});
imgEl.addEventListener('mouseleave', event => {
	tooltip.style.visibility = 'hidden';
});
