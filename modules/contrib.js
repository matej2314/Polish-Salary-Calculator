module.exports.contrib = getContributions = type => {
	switch (type) {
		case 'wszystkie':
			return { penContrib: 0.0976, disContrib: 0.015, sickContrib: 0.0245, hiPremium: 0.09 };
		case 'bez-skladki-chorobowej':
			return { penContrib: 0.0976, disContrib: 0.015, sickContrib: 0, hiPremium: 0.09 };
		case 'bez-ubezpieczenia-spolecznego':
			return { penContrib: 0, disContrib: 0, sickContrib: 0, hiPremium: 0 };
		case 'bez-ubezpieczenia-spolecznego-i-zdrowotnego':
			return { penContrib: 0, disContrib: 0, sickContrib: 0, hiPremium: 0 };
		case 'bez-skladek-emerytalno-rentowych':
			return { penContrib: 0, disContrib: 0, sickContrib: 0.0245, hiPremium: 0.09 };
		default:
			return { penContrib: 0, disContrib: 0, sickContrib: 0, hiPremium: 0.09 }; // Domyślna wartość
	}
};
