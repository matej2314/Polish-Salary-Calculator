'use strict';
import { downloadXCELL, downloadPDFFILE } from '../modules/downloadFiles.js';

document.querySelector('.btn-pdf').addEventListener('click', downloadPDFFILE);

document.querySelector('.btn-excel').addEventListener('click', downloadXCELL);

const backBtn = document.querySelector('.back-btn');

backBtn.addEventListener('click', function () {
	dropList.classList.toggle('hidden');
});
