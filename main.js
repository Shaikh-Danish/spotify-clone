'use strict';

const logInBtn = document.getElementById('log-in');
const APP_URL = 'https://shaikh-danish.github.io/spotify-clone';
const CLIENT_ID = '6db36a01e85845119836d789ac6c1e61';

const REDIRECT_URI = `${APP_URL}`;
const scope = 'user-read-private user-read-email playlist-read-private user-follow-read user-library-read user-top-read user-read-recently-played user-library-read user-read-playback-state playlist-read-collaborative user-read-recently-played';
const TOKEN_PARAM_KEYS = ['access_token', 'token_type', 'expires_in'];
let logIn = true;


function spotifyLogIn() {
		let url = 'https://accounts.spotify.com/authorize';
		url += '?response_type=token';
		url += '&client_id=' + 				encodeURIComponent(CLIENT_ID);
		url += '&scope=' + encodeURIComponent(scope);
		url += '&redirect_uri=' + encodeURIComponent(REDIRECT_URI);
		window.open(url, 'login', 'width=600, height=800');
		logIn = true;
}

function getUrlParams(hash) {
		const urlParams = new URLSearchParams(hash);
		
		return TOKEN_PARAM_KEYS.map((key) => urlParams.get(key))
}

function setItemsInLocalStorage(...tokens) {
		tokens.forEach((currToken, i) => {
				localStorage.setItem(TOKEN_PARAM_KEYS[i], currToken);
		});
}

logInBtn.addEventListener('click', spotifyLogIn);


document.addEventListener('DOMContentLoaded', function() {
		if (logIn) {
				const hash = window.location.hash.replace('#', '?');
				const [accessToken, tokenType, expiresIn] = getUrlParams(hash);
				const access_Token = localStorage.getItem(TOKEN_PARAM_KEYS[0]);
		
				if (access_Token) {
						window.location = `${APP_URL}/dashboard/dashboard.html`;
						setItemsInLocalStorage(accessToken, tokenType, expiresIn);
				}	
				else if (accessToken) {	
						window.location = `${APP_URL}/dashboard/dashboard.html`;
						//window.close();		
						setItemsInLocalStorage(accessToken, tokenType, expiresIn);
				}
				else {
						window.close();
				}		
				logIn = false;
		}
});
