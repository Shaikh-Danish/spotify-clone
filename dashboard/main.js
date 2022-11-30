const ACCESS_TOKEN_KEY = 'access_token';
const APP_URL = 'http://localhost:8080';
const TOKEN_PARAM_KEYS = ['access_token', 'token_type', 'expires_in'];


function getUrlParams(hash) {
		const urlParams = new URLSearchParams(hash);
		
		return TOKEN_PARAM_KEYS.map((key) => urlParams.get(key))
}

function setLocalStorageItems(...tokens) {
		console.log(tokens);
		tokens.forEach((currToken, i) => {
				localStorage.setItem(TOKEN_PARAM_KEYS[i], currToken);
		});
}


document.querySelector('.header').addEventListener('click', function() {
		
		if ()
		const hash = window.location.hash.replace('#', '?');
		
		const [accessToken, tokenType, expiresIn] = getUrlParams(hash);
		
		setLocalStorageItems(accessToken, tokenType, expiresIn);
		
		if (accessToken) {
				parent.location.hash = ``;
		}
});
