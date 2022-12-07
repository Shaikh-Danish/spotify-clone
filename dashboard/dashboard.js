"use strict";

const logOutBtn = document.getElementById('log-out');

/* Already declared in login.js */
const ACCESS_TOKEN_KEY = "access_token";
const TOKEN_TYPE_KEY = "token_type";
const EXPIRES_IN_KEY = "expires_in";
const APP_URL = "http://localhost:8080";

const BASE_API_URL = "https://api.spotify.com/v1";
const ENDPOINT = {
		"userinfo": "me"
}

/* API related funtions */
function getAccessToken() {
		const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
		const tokenType = localStorage.getItem(TOKEN_TYPE_KEY);
		const expiresIn = localStorage.getItem(EXPIRES_IN_KEY);
		
		if (Date.now() > expiresIn) {
				return { accessToken, tokenType };
		} else {
				logOut();
		}
}

function logOut() {
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		localStorage.removeItem(TOKEN_TYPE_KEY);
		localStorage.removeItem(EXPIRES_IN_KEY);
		
		window.location = `${APP_URL}/index.html`;
}

function createApiConfig({ accessToken, tokenType }, method = "GET") {
		return {
				headers: {
						Authorization: `${tokenType} ${accessToken}`,
				},
				method
		}
}

async function fetchRequest(endpoint) {
		const creds = createApiConfig(getAccessToken());
		const url = `${BASE_API_URL}/${endpoint}`;
		const request = await fetch(url, creds);
		return request.json();
}
/* API related funtions */

async function loadUserProfile() {
		const profileImg = document.getElementById("user-profile-img");
		const displayNameElement = document.getElementById("user-name");
		
		const { display_name: displayName, images } = await fetchRequest(ENDPOINT.userinfo);
		
		displayNameElement.textContent = displayName;
		
		if (images?.length) {
				profileImg.src = images[0].url;
		}
}

/*
document.getElementById("user-option-btn").addEventListener("click", function() {
		loadUserProfile();
});
*/

logOutBtn.addEventListener("click", logOut);

document.addEventListener("DOMContentLoaded", function() {
		loadUserProfile();
});

