'use strict';
import { downloadXCELL, downloadPDFFILE } from '../modules/downloadFiles.js';
<<<<<<< HEAD

const btnPrevSite = document.querySelector('.btn_prev_site');
const backBtn = document.querySelector('.back-btn');
const dropList = document.querySelector('.dropdown');
=======
const isU26Used = localStorage.getItem('isU26Used');
const isCalcResult = localStorage.getItem('isCalcResult');
const btnPrevSite = document.querySelector('.btn_prev_site');
const referer = document.referrer;
>>>>>>> 149e9d77eb958f6c9ff13826db40875f61ddbf60

document.querySelector('.btn-pdf').addEventListener('click', downloadPDFFILE);

document.querySelector('.btn-excel').addEventListener('click', downloadXCELL);

<<<<<<< HEAD
=======
const backBtn = document.querySelector('.back-btn');
const dropList = document.querySelector('.dropdown');

>>>>>>> 149e9d77eb958f6c9ff13826db40875f61ddbf60
backBtn.addEventListener('click', function () {
	window.location.href = '/buttons';
});

backBtn.addEventListener('mouseover', e => {
	dropList.classList.remove('hidden');
});
backBtn.addEventListener('mouseleave', e => {
	dropList.classList.add('hidden');
});

btnPrevSite.addEventListener('click', function () {
	window.location.href = '/buttons';
});
<<<<<<< HEAD

export const getToken = function () {
	sessionStorage.clear();
	const token = localStorage.getItem('token');

	if (!token) {
		console.error('Błąd uwierzytelniania');
		return;
	}
};
=======
>>>>>>> 149e9d77eb958f6c9ff13826db40875f61ddbf60
