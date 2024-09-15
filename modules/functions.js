'use strict';
export const adjustSelectWidth = selectElement => {
	const tempDiv = document.createElement('div');
	document.body.appendChild(tempDiv);

	const computedStyle = window.getComputedStyle(selectElement);
	Object.assign(tempDiv.style, {
		fontSize: computedStyle.fontSize,
		fontFamily: computedStyle.fontFamily,
		fontWeight: computedStyle.fontWeight,
		letterSpacing: computedStyle.letterSpacing,
		whiteSpace: 'nowrap',
		position: 'absolute',
		top: '-9999px',
	});

	tempDiv.textContent = selectElement.options[selectElement.selectedIndex].text;
	selectElement.style.width = `${tempDiv.offsetWidth + 35}px`;

	document.body.removeChild(tempDiv);
};
