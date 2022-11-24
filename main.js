'use strict';

const hamburger = document.getElementById('hamburger-btn');
const clientId = '6db36a01e85845119836d789ac6c1e61';
const redirectUri = 'https://shaikh-danish.github.io/spotify-clone/';
const scope = 'user-read-private user-read-email';

function spotifyLogIn() {
		let url = 'https://accounts.spotify.com/authorize';
		url += '?response_type=token';
		url += '&client_id=' + 				encodeURIComponent(clientId);
		url += '&scope=' + encodeURIComponent(scope);
		url += '&redirect_uri=' + encodeURIComponent(redirectUri);
		window.location = url;
		console.log(window.location.search);
		document.body.onload = function() {
				this.textContent = url;
		}
}

function openNavMenu() {
		/*
		let isOpened = hamburger.getAttribute('aria-expanded');
		
		if (isOpened === 'false')
		{
				hamburger.ariaExpanded = 'true';
				//prevent background scrolling
				document.body.style.overflowY = 'hidden';
		}
		else {
				hamburger.ariaExpanded = 'false';
				//enable scrolling
				document.body.style.overflowY = 'visible';
		}
		*/
		
		hamburger.ariaExpanded = hamburger.ariaExpanded === 'false' ? 'true' : 'false';
		
		document.body.style.overflowY = hamburger.ariaExpanded === 'false' ? 'visible' : 'hidden';
} 

document.getElementById('log-in').addEventListener('click', spotifyLogIn);

hamburger.addEventListener('click', openNavMenu);


const getGenres = async (token) => {
		const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
		method: 'GET',
  headers: { 'Authorization' : 'Bearer ' + token}
  });
  const data = await result.json();
  return data.categories.items;
}
