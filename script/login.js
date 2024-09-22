'use strict';
window.onload = function () {
	localStorage.clear();
	sessionStorage.clear();
	const referrer = document.referrer;

	if (referrer.includes('/register')) {
		document.getElementById('welcomemessage').innerText = 'Użytkownik zarejestrowany. Możesz się zalogować.';
	} else {
		document.getElementById('welcomemessage').innerText = 'Witaj na stronie głównej kalkulatora wynagrodzeń!';
	}
};

const submBtn = document.getElementById('btn-login');
const form = document.querySelector('.register-form');
const userIn = document.getElementById('username-input');
const userPass = document.getElementById('userpasswd');
const loginCont = document.querySelector('.login-container');

userIn.addEventListener('input', event => {
	if (userIn.validity.typeMismatch) {
		userIn.setCustomValidity('Podaj prawidłowy login!');
	} else {
		userIn.setCustomValidity('');
	}
});
userPass.addEventListener('input', event => {
	if (userPass.validity.typeMismatch) {
		userPass.setCustomValidity('Podaj prawidłowe hasło!');
	} else {
		userPass.setCustomValidity('');
	}
});

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
		alert('Dane poprawne');
	}
}

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

document.getElementById('login-form').addEventListener('submit', async function (event) {
	event.preventDefault();

	const username = document.getElementById('username-input').value;
	const password = document.getElementById('userpasswd').value;

	try {
		const response = await fetch('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: username, userpasswd: password }),
		});

		const result = await response.json();
		console.log('Server response:', result);

		if (response.ok) {
			alert(result.message);
			localStorage.setItem('token', result.token);
			window.location.href = '/buttons';
		} else {
			alert(result.message);
		}
	} catch (error) {
		console.error('Błąd:', error);
		alert('Wystąpił błąd podczas logowania.');
		window.reload();
	}
});
