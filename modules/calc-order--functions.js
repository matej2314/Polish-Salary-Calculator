const btnYes = document.querySelector('.btn-yes');
const btnNo = document.querySelector('.btn-no');
const btnBack = document.querySelector('.btn-back');

btnYes.addEventListener('click', function () {
	modalSelect.setAttribute('disabled', 'disabled');
	mainCont.classList.remove('hidden');
	modalEl.classList.add('hidden');
	btnBack.classList.remove('hidden');
});

btnNo.addEventListener('click', function () {
	mainCont.classList.remove('hidden');
	modalEl.classList.add('hidden');
	btnBack.classList.remove('hidden');
});

btnBack.addEventListener('click', function () {
	window.location.href = '/buttons';
});
