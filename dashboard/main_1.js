'use strict';

const hamburger = document.getElementById('hamburger-btn');
const CLIENT_ID = '6db36a01e85845119836d789ac6c1e61';
//const REDIRECT_URI = 'https://shaikh-danish.github.io/spotify-clone/';
const REDIRECT_URI = 'http://localhost:8080/';
const scope = 'user-read-private user-read-email';
const ACCESS_TOKEN_KEY = 'accessToken';

function spotifyLogIn() {
		let url = 'https://accounts.spotify.com/authorize';
		url += '?response_type=token';
		url += '&client_id=' + 				encodeURIComponent(CLIENT_ID);
		url += '&scope=' + encodeURIComponent(scope);
		url += '&redirect_uri=' + encodeURIComponent(REDIRECT_URI);
	//window.open(url, 'login', "width=400, height=600");
	window.location.href = url;
	//window.location = 'hello';
	window.location = `${localStorage.getItem('access_token')}/hello`;
}

function openNavMenu() {
		
		hamburger.ariaExpanded = hamburger.ariaExpanded === 'false' ? 'true' : 'false';
		
		document.body.style.overflowY = hamburger.ariaExpanded === 'false' ? 'visible' : 'hidden';
} 

document.getElementById('log-in').addEventListener('click', spotifyLogIn);

hamburger.addEventListener('click', openNavMenu);

window.addEventListener('load', function() {
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		localStorage.setItem('access_token', window.location.hash);
		console.log(localStorage.getItem('access_token'));
		body.innerHTML = localStorage.getItem('access_token');
		window.location = 'hash';
});
