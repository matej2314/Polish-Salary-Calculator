'use strict';
const regCont = document.querySelector('.register-container');
const passMsg = document.querySelector('.diff-passwd');
const regPass = document.getElementById('reg-passwd');
const regName = document.getElementById('reg-username');
const regEmail = document.getElementById('reg-email');

regName.addEventListener('input', event => {
	if (regName.validity.typeMismatch) {
		regName.setCustomValidity('Podaj prawidłową nazwę użytkownika!');
	} else {
		regName.setCustomValidity('');
	}
});
regPass.addEventListener('input', event => {
	if (regPass.validity.typeMismatch) {
		regPass.setCustomValidity('Wpisz prawidłowe hasło!');
	} else {
		regPass.setCustomValidity('');
	}
});
regEmail.addEventListener('input', event => {
	if (regEmail.validity.typeMismatch) {
		regEmail.setCustomValidity('Podaj prawidłowy adres e-mail!');
	} else {
		regEmail.setCustomValidity('');
	}
});

function sanitizeInput(input) {
	return input.replace(/[^a-z0-9]/gi, '');
}

function isAlphaNumeric(input) {
	return /^[a-z0-9]+$/i.test(input);
}

function containsDangerousCharacters(input) {
	const dangerousPattern = /[<>"'`;&\/]|(--|\/\*|\*\/|select|insert|update|delete|drop|alter|truncate)/i;
	return dangerousPattern.test(input);
}

function processInput() {
	const inputFields = document.querySelectorAll('input');
	let allFieldsValid = true;

	for (let i = 0; i < inputFields.length; i++) {
		let sanitizedValue = sanitizeInput(inputFields[i].value.trim());
		inputFields[i].value = sanitizedValue;

		if (containsDangerousCharacters(sanitizedValue)) {
			alert('Pole ' + (i + 1) + ' zawiera niebezpieczne znaki!');
			allFieldsValid = false;
			break;
		}

		if (!isAlphaNumeric(sanitizedValue)) {
			alert('Pole ' + (i + 1) + ' może zawierać tylko litery i cyfry!');
			allFieldsValid = false;
			break;
		}
	}

	if (allFieldsValid) {
		alert('Zarejestrowano użytkownika');
	}
}
