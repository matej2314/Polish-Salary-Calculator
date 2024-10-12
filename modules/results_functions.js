'use strict';
import { downloadXCELL, downloadPDFFILE } from '../modules/downloadFiles.js';

const btnPrevSite = document.querySelector('.btn_prev_site');
const backBtn = document.querySelector('.back-btn');
const dropList = document.querySelector('.dropdown');

document.querySelector('.btn-pdf').addEventListener('click', downloadPDFFILE);

document.querySelector('.btn-excel').addEventListener('click', downloadXCELL);

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

export const getToken = function () {
	sessionStorage.clear();
	const token = localStorage.getItem('token');

	if (!token) {
		console.error('Błąd uwierzytelniania');
		return;
	}
};
