export const downloadXCELL = async () => {
	try {
		const token = localStorage.getItem('token');
		if (!token) {
			throw new Error('Błąd autoryzacji');
		}
		const response = await fetch('/generate-excel', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Błąd pobierania pliku: ${response.status} ${response.statusText} ${errorText}`);
		}
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'wyniki.xlsx';
		document.body.appendChild(a);
		a.click();
		a.remove();
		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.log('Błąd podczas pobierania pliku:', error);
	}
};

export const downloadPDFFILE = async (req, res) => {
	try {
		const token = localStorage.getItem('token');

		if (!token) {
			throw new Error('Błąd autoryzacji');
		}

		const response = await fetch('/generate-pdf', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error('Błąd pobierania pliku PDF');
		}

		const blob = await response.blob();

		const url = window.URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'wyniki.pdf';
		document.body.appendChild(a);
		a.click();

		a.remove();

		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.log('Wystąpił błąd podczas pobierania pliku PDF:', error);
	}
};
