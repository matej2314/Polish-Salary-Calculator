const userIn = document.getElementById('username-input');
const userPass = document.getElementById('userpasswd');
const tooltip1 = document.querySelector('.tooltip-text');
const tooltip2 = document.querySelector('.tooltip2-text');

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
