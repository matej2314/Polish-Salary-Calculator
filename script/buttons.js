'use strict';
import { btnsClickEvents } from '/modules/btnsClick.js';

const imgEl = document.querySelector('.info-sign');
const tooltip = document.querySelector('.tooltip-text');

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

const btnsElements = [firstBtn, secondBtn, thirdBtn, fourthBtn, seventhBtn, eighthBtn, ninethBtn, tenthBtn, eleventhBtn, twelvethBtn, thirteenthBtn, fourteenBtn, fifteenBtn];

btnsElements.forEach(button => {
	button.addEventListener('click', function () {
		button.classList.toggle('clicked');
	});
});

btnsClickEvents();

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
