'use strict';
import { btnsClickEvents } from '/modules/btnsClick.js';

const btnsContainer = document.querySelector('.btns-container');
const orderBtn = document.querySelector('.btn-order');
const contractBtn = document.querySelector('.btn-contr');
const specWrkBtn = document.querySelector('.btn-specwrk');
const modal1El = document.querySelector('.modal-questions');
const modal2El = document.querySelector('.modal-questions-order');
const imgEl = document.querySelector('.info-sign');
const tooltip = document.querySelector('.tooltip-text');
const selectContr = document.getElementById('wkrplcs-count');
const selectOrder = document.getElementById('wkrplcs-count-order');

const firstBtn = document.querySelector('.first-btn-yes');
const secondBtn = document.querySelector('.first-btn-no');
const thirdBtn = document.querySelector('.second-btn-yes');
const fourthBtn = document.querySelector('.second-btn-no');
const fifthBtn = document.querySelector('.third-btn-yes');
const sixthBtn = document.querySelector('.third-btn-no');

const seventhBtn = document.querySelector('.first-btn-order-yes');
const eighthBtn = document.querySelector('.first-btn-order-no');
const ninethBtn = document.querySelector('.second-btn-order-no');
const tenthBtn = document.querySelector('.second-btn-order-yes');
const eleventhBtn = document.querySelector('.third-btn-order-yes');
const twelvethBtn = document.querySelector('.third-btn-order-no');
const thirteenthBtn = document.querySelector('.third-btn-order-nd');
const fourteenBtn = document.querySelector('.fourth-btn-order-yes');
const fifteenBtn = document.querySelector('.fourth-btn-order-no');

const btnsElements = [firstBtn, secondBtn, thirdBtn, fourthBtn, fifthBtn, sixthBtn, seventhBtn, eighthBtn, ninethBtn, tenthBtn, eleventhBtn, twelvethBtn, thirteenthBtn, fourteenBtn, fifteenBtn];

btnsElements.forEach(button => {
	button.addEventListener('click', function () {
		button.classList.toggle('clicked');
	});
});

btnsClickEvents();

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

if (selectContr.value === '2' || selectOrder.value === '2') {
	sessionStorage.setItem('twoWorkplaces', 'true');
}
if (selectContr.value === '3' || selectOrder.value === '3') {
	sessionStorage.setItem('threeWorkplaces', 'true');
}

imgEl.addEventListener('mouseover', event => {
	tooltip.style.visibility = 'visible';
});
imgEl.addEventListener('mouseleave', event => {
	tooltip.style.visibility = 'hidden';
});

const buttons = [firstBtn, secondBtn, thirdBtn, fourthBtn, fifthBtn, sixthBtn];
const btns = [seventhBtn, eighthBtn, ninethBtn, tenthBtn, eleventhBtn, twelvethBtn, thirteenthBtn, fourteenBtn, fifteenBtn];

function isAnyButtonClicked(buttonArray) {
	return buttonArray.some(button => button.classList.contains('clicked'));
}

document.querySelector('.btn-next').addEventListener('click', function (e) {
	e.preventDefault();
	if (isAnyButtonClicked(buttons)) {
		window.location.href = '/main-calc';
	} else {
		alert('Odpowiedz na pytania!');
	}
});

document.getElementById('btn-next-order').addEventListener('click', function (e) {
	e.preventDefault();
	if (isAnyButtonClicked(btns)) {
		window.location.href = '/calc-order';
	} else {
		alert('Odpowiedz na pytania!');
	}
});
