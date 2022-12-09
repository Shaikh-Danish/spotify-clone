"use strict";

const logOutBtn = document.getElementById('log-out');
const userProfileBtn = document.getElementById("user-option-btn");

/* Already declared in login.js */
const ACCESS_TOKEN_KEY = "access_token";
const TOKEN_TYPE_KEY = "token_type";
const EXPIRES_IN_KEY = "expires_in";
const APP_URL = "https://shaikh-danish.github.io/spotify-clone";

const BASE_API_URL = "https://api.spotify.com/v1";
const ENDPOINT = {
		"userinfo": "me",
		"featuredPlaylist": "browse/featured-playlists?limit=10",
		"recentlyPlayed": "me/player/recently-played",
		"tracks": "tracks/"
}
const contentHeaders = ["Recently played"];

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

async function getFeaturedPlaylist() {
		const { playlists: { items } } = await fetchRequest(ENDPOINT.featuredPlaylist);
		
		const featuredSection = document.getElementById("featured");
		
		featuredSection.innerHTML = `
				<div class="feature__header">
						<h2>Featured</h2>
				</div>
				<div class="featured__playlist">	
						<ul class="featured__playlist-list cards-list flex" id="featured-playlist">
						</ul>								 
				</div>`;
				
			const featuredList = document.getElementById("featured-playlist");
			
			items.forEach(item => {
					const {name: playlistName, description, id, images} = item;
					
					const listItem = document.createElement("li");
					listItem.classList.add("featured__item", "card-item");
					
					listItem.innerHTML = `
							<div class="featured__playlist-img">
							 	<img src="${images[0].url}" alt="${playlistName}" class="card-img-width">
							</div>
							<div class="featured__playlist-info">
									<h4 class="featured__playlist-name">${playlistName}</h4>
							 	<p class="featured__playlist-description">${description}</p>
							</div>`;
					featuredList.appendChild(listItem);
			});
}

/*
async function displayRecentTracks() {
		const recent = await fetchRequest(ENDPOINT.recentlyPlayed);
		
		const contentSection = document.createElement("section");
		contentSection.classList.add("recent");
		
		contentSection.innerHTML = `
				<div class="recent__header">
								<h2>Recently played</h2>
		 	</div>
		 	<div class="recent__tracks">
				  <ul class="recent__tracks-list cards-list" id="recent-track">
						</ul>
				</div>
			`;
			
			const cardsList = document.getElementById("recent-track");
			
			recent.items.forEach(item => {
					const { name: trackName, id: trackId} = item.track;
					const track = await fetchRequest(`${ENDPOINT.track}/${trackId}`})
			});
		document.getElementById("content").appendChild(contentSection);
		
}
*/

userProfileBtn.addEventListener("click", function() {
		userProfileBtn.ariaExpanded = userProfileBtn.ariaExpanded === "false" ? "true": "false";
		
		//displayRecentTracks();
});


logOutBtn.addEventListener("click", logOut);

document.addEventListener("DOMContentLoaded", function() {
		loadUserProfile();
		getFeaturedPlaylist();
});

