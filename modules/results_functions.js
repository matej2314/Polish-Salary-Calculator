'use strict';
import { downloadXCELL, downloadPDFFILE } from '../modules/downloadFiles.js';
const isU26Used = localStorage.getItem('isU26Used');
const isCalcResult = localStorage.getItem('isCalcResult');
const btnPrevSite = document.querySelector('.btn_prev_site');
const referer = document.referrer;

document.querySelector('.btn-pdf').addEventListener('click', downloadPDFFILE);

document.querySelector('.btn-excel').addEventListener('click', downloadXCELL);

const backBtn = document.querySelector('.back-btn');
const dropList = document.querySelector('.dropdown');

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
