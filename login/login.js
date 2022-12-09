"use strict";

const logInBtn = document.getElementById("log-in");
const APP_URL = 'https://shaikh-danish.github.io/spotify-clone';
const CLIENT_ID = '6db36a01e85845119836d789ac6c1e61';
const REDIRECT_URI = `${APP_URL}/login/login.html`;
const scope = "user-read-private user-read-email playlist-read-private user-follow-read user-library-read user-read-recently-played user-top-read playlist-read-collaborative user-read-playback-state user-read-currently-playing";
const ACCESS_TOKEN_KEY = "access_token";
const TOKEN_TYPE_KEY =  "token_type";
const EXPIRES_IN_KEY = "expires_in";


function authorizeUser() {
		let url = "https://accounts.spotify.com/authorize";
		url += "?response_type=token";
		url += "&client_id=" + 				encodeURIComponent(CLIENT_ID);
		url += "&scope=" + encodeURIComponent(scope);
		url += "&redirect_uri=" + encodeURIComponent(REDIRECT_URI);
		
		//window.open(url, "login", "width=600, height=800");
		window.location.href = url;
}


function getUrlParams(hash) {
		const urlParams = new URLSearchParams(hash);
		
		return [ACCESS_TOKEN_KEY, TOKEN_TYPE_KEY, EXPIRES_IN_KEY].map((key) => urlParams.get(key))
}


function setItemsInLocalStorage(accessToken, tokenType, expiresIn) {
		localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
		localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
		localStorage.setItem(EXPIRES_IN_KEY, (Number(Date.now()) + Number(expiresIn) * 1000));
		
}


logInBtn.addEventListener("click", authorizeUser);


window.addEventListener("load", function() {
		
		const access_Token = localStorage.getItem(ACCESS_TOKEN_KEY);
		
		if (access_Token) {
				window.location.href = `${APP_URL}/dashboard/dashboard.html`;
		}
		
		const hash = window.location.hash.replace('#', '?');
		const [accessToken, tokenType, expiresIn] = getUrlParams(hash);
				
		if (accessToken) {
				setItemsInLocalStorage(accessToken, tokenType, expiresIn);
					//	window.close();
				window.location.href = `${APP_URL}/dashboard/dashboard.html`;						
		}
		/*
		else {
				window.close();
		}
		
		
		if (window.opener !== null && !window.opener.closed) {
				window.focus()
				if (window.location.href.includes('error')) {
						window.close();
				}		
		}
		*/
});
