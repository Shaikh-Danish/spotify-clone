"use strict";

import APP_URL from '../common.js';

const logOutBtn = document.getElementById('log-out');
const userProfileBtn = document.getElementById("user-option-btn");

/* Already declared in login.js */
const ACCESS_TOKEN_KEY = "access_token";
const TOKEN_TYPE_KEY = "token_type";
const EXPIRES_IN_KEY = "expires_in";
//const APP_URL = "https://shaikh-danish.github.io/spotify-clone";
//const APP_URL = "http://127.0.0.1:8080";

const BASE_API_URL = "https://api.spotify.com/v1";
const ENDPOINT = {
		"userinfo": "me",
		"featuredPlaylist": "browse/featured-playlists?limit=10",
		"toplist": "browse/categories",
		"playlist": "me/playlists"
}

/* API related funtions */
function getAccessToken() {
		const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
		const tokenType = localStorage.getItem(TOKEN_TYPE_KEY);
		const expiresIn = localStorage.getItem(EXPIRES_IN_KEY);
		
		if (Date.now() < expiresIn) {
				return { accessToken, tokenType };
		} else {
				logOut();
		}
}

function logOut() {
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		localStorage.removeItem(TOKEN_TYPE_KEY);
		localStorage.removeItem(EXPIRES_IN_KEY);
		
		window.location.href = `${APP_URL}/login/login.html`;
}

function createApiConfig({ accessToken, tokenType }, method = "GET") {
		return {
				headers: {
						Authorization: `${tokenType} ${accessToken}`
				},
				method
		}
}

/* Api related funtions */

async function fetchRequest(endpoint) {
		const creds = createApiConfig(getAccessToken());
		
		const url = `${BASE_API_URL}/${endpoint}`;
		const request = await fetch(url, creds);
		return request.json();
}


async function loadUserProfile() {
		const profileImg = document.getElementById("user-profile-img");
		const displayNameElement = document.getElementById("user-name");
	
		const { display_name: displayName, images } = await fetchRequest(ENDPOINT.userinfo);
		
		displayNameElement.textContent = displayName;
		
		if (images?.length) {
				profileImg.src = images[0].url;
		}
}



function onPlaylistClick(event) {
		console.log(this.outerHTML);
}

async function loadPlaylists(endpoint, sectionId, key) {
		const playlist = await fetchRequest(endpoint);
		const { items } = playlist[key] ?? playlist;

		const cardSection = document.querySelector(`#${sectionId} .card-section`);
		
		items.forEach(item => {
				const {name: playlistName, description, id, images, icons} = item;
				
				const card = document.createElement("div");
				card.classList.add("card");
				
				card.innerHTML = `
						<img src="${images?.[0].url ?? icons?.[0].url}" alt="${playlistName}" class="card-img-width">
						<p class="card-name">${playlistName}</p>
						${description !== undefined ? `<p class="card-description">${description}</p>`: ""}`;
				card.id = id;
			 cardSection.appendChild(card);
				card.addEventListener("click", onPlaylistClick);	
		});
		
}

function playlists() {		
		loadPlaylists(ENDPOINT.featuredPlaylist, "featured-playlist", "playlists");
		loadPlaylists(ENDPOINT.toplist, "top-playlist", "categories");
		loadPlaylists(ENDPOINT.playlist, "user-playlist")
		
}

function fillContent() {
		const contentSection = document.getElementById("content");
		const playlistMap = new Map([
				["featured", "featured-playlist"],
				["top playlists", "top-playlist"],
				["playlist", "user-playlist"]
		]);
		let content = "";
		
		for (const [type, id] of playlistMap) {
				content += `
				<section id="${id}">
						<h3 class="section-header">${type}</h3>
						<section class="card-section"></section>
				</section>`;
		}
		contentSection.innerHTML = content;
}

userProfileBtn.addEventListener("click", function() {
		userProfileBtn.ariaExpanded = userProfileBtn.ariaExpanded === "false" ? "true": "false";
		//import { dope } from "../api.js";
		//console.log(dope)
		console.log(APP_URL);
});


//logOutBtn.addEventListener("click", logOut);

document.addEventListener("DOMContentLoaded", function() {
		loadUserProfile();
		fillContent();
		playlists();
});

