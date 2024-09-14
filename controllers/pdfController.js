const puppeteer = require('puppeteer');
require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');

async function generatePDF(req, res) {
	const { url, extraData } = req.body;

	console.log('Received URL:', url);
	console.log('Received extraData:', extraData);

	try {
		const browser = await puppeteer.launch({
			headless: false, // Tryb graficzny do debugowania
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});
		const page = await browser.newPage();

		console.log('Browser launched');

		await page.goto(url, { waitUntil: 'domcontentloaded' });
		console.log('Navigated to URL:', url);

		await page.evaluate(token => {
			localStorage.setItem('token', token);
		}, process.env.JWT_SECRET);

		await page.goto(url, { waitUntil: 'networkidle2' });
		console.log('Navigated to results page');

		await page.waitForSelector('.results-container', { timeout: 60000 });
		console.log('Results container loaded');

		if (extraData.description) {
			await page.evaluate(extraData => {
				const descriptionElement = document.createElement('div');
				descriptionElement.innerHTML = `<p>${extraData.description}</p>`;
				descriptionElement.style.marginBottom = '10px';
				document.body.insertBefore(descriptionElement, document.body.firstChild);
			}, extraData);
			console.log('Description added:', extraData.description);
		}

		await page.waitForFunction(
			() => {
				const inputs = document.querySelectorAll('input');
				return Array.from(inputs).every(input => input.value !== '');
			},
			{ timeout: 60000 }
		);

		await page.waitForTimeout(5000); // Opóźnienie 5 sekund

		const pdf = await page.pdf({
			format: 'A4',
			printBackground: true,
			margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
		});
		console.log('PDF generated');

		await browser.close();

		// Debugowanie PDF - zapisz na dysku, aby sprawdzić zawartość
		const pdfPath = path.join(__dirname, 'debug.pdf');
		fs.writeFileSync(pdfPath, pdf);
		console.log(`PDF saved to ${pdfPath}`);

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', 'attachment; filename="wyniki.pdf"');
		res.send(pdf);
	} catch (error) {
		console.error('Błąd generowania pliku:', error);
		res.status(500).send('Błąd generowania pliku');
	}
}

module.exports = { generatePDF };
