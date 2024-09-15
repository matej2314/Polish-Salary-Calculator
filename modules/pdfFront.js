'use strict';

export const pdfSendData = async function () {
	try {
		const token = localStorage.getItem('token');

		if (!token) {
			console.log('Błąd autoryzacji');
			return;
		}

		const calcresultsDesc = localStorage.getItem('calcresults.description');
		const orderDesc = localStorage.getItem('calcsU26.description');

		// Sprawdzenie, czy oba opisy są dostępne
		if (!calcresultsDesc && !orderDesc) {
			alert('Brak danych do generowania PDF');
			return;
		}

		// Tworzymy obiekt extraData na podstawie dostępnych opisów
		const extraData = {
			description: calcresultsDesc || orderDesc || 'Brak opisu',
		};

		// Wysłanie żądania o generowanie PDF
		const response = await fetch('/generate-pdf', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				url: window.location.href, // Podaj bieżący adres URL
				extraData: extraData, // Przekaż dane z localStorage
			}),
		});

		// Sprawdź, czy odpowiedź z serwera jest poprawna
		if (response.ok) {
			const blob = await response.blob();
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'wyniki.pdf'; // Nadajemy nazwę plikowi PDF
			link.click();
		} else {
			const errorText = await response.text();
			alert('Błąd generowania pliku: ' + errorText);
		}
	} catch (error) {
		alert('Wystąpił błąd: ' + error.message);
	}
};
