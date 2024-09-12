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
		alert('Zarejestrowano użytkownika');
	}
}
