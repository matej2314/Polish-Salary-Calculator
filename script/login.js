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
const tooltip1 = document.querySelector('.tooltip-text');
const tooltip2 = document.querySelector('.tooltip2-text');

const loginCont = document.querySelector('.login-container');

//tooltps to inputs

userIn.addEventListener('mouseover', event => {
	tooltip1.style.visibility = 'visible';
});
userIn.addEventListener('mouseleave', event => {
	tooltip1.style.visibility = 'hidden';
});
userPass.addEventListener('mouseover', event => {
	tooltip2.style.visibility = 'visible';
});
userPass.addEventListener('mouseleave', event => {
	tooltip2.style.visibility = 'hidden';
});

//basic validation of userinputs

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
		// Sanityzacja wartości
		let sanitizedValue = sanitizeInput(inputFields[i].value.trim());
		inputFields[i].value = sanitizedValue;

		// Sprawdzenie czy wartość zawiera niebezpieczne znaki
		if (containsDangerousCharacters(sanitizedValue)) {
			alert('Pole ' + (i + 1) + ' zawiera niebezpieczne znaki!');
			allFieldsValid = false;
			break; // Zatrzymuje pętlę po znalezieniu błędu
		}

		// Sprawdzenie czy wartość jest alfanumeryczna
		if (!isAlphaNumeric(sanitizedValue)) {
			alert('Pole ' + (i + 1) + ' może zawierać tylko litery i cyfry!');
			allFieldsValid = false;
			break; // Zatrzymuje pętlę po znalezieniu błędu
		}
	}

	// Jeśli wszystkie pola są poprawne, przekieruj
	if (allFieldsValid) {
		alert('Dane poprawne');
	}
}

// Przykładowa funkcja sanitizująca - usuwa niepożądane znaki
function sanitizeInput(input) {
	// Możesz rozszerzyć to, aby usunąć więcej niebezpiecznych znaków
	return input.replace(/[^a-z0-9]/gi, ''); // Zachowaj tylko litery i cyfry
}

// Funkcja sprawdzająca alfanumeryczność
function isAlphaNumeric(input) {
	return /^[a-z0-9]+$/i.test(input); // Sprawdź, czy ciąg zawiera tylko litery i cyfry
}

// Funkcja sprawdzająca niebezpieczne znaki typowe dla XSS i SQL Injection
function containsDangerousCharacters(input) {
	// Szukamy znaków lub sekwencji używanych w XSS i SQL Injection
	const dangerousPattern = /[<>"'`;&\/]|(--|\/\*|\*\/|select|insert|update|delete|drop|alter|truncate)/i;
	return dangerousPattern.test(input);
}

document.getElementById('login-form').addEventListener('submit', async function (event) {
	event.preventDefault(); // Zapobiega domyślnemu działaniu formularza

	const username = document.getElementById('username-input').value;
	const password = document.getElementById('userpasswd').value;

	try {
		const response = await fetch('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: username, userpasswd: password }), // Używamy username i password
		});

		const result = await response.json();
		console.log('Server response:', result);

		if (response.ok) {
			alert(result.message);
			localStorage.setItem('token', result.token);
			window.location.href = 'buttons.html';
		} else {
			alert(result.message);
		}
	} catch (error) {
		console.error('Błąd:', error);
		alert('Wystąpił błąd podczas logowania.');
		window.reload();
	}
});
