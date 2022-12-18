"use strict";

/* Select Elements */
const logOutBtn = document.getElementById('log-out');
const userProfileBtn = document.getElementById("user-option-btn");
const mainContent = document.getElementById("content");


userProfileBtn.addEventListener("click", function() {
		userProfileBtn.ariaExpanded = userProfileBtn.ariaExpanded === "false" ? "true": "false";
});


function createSectionContent(name,  images, description) {
		const content = `
						<img src="${(images[0].url ?? images)}" alt="${name}" class="playlist-img">
						<p class="playlist-name line-clamp">${name}</p>
						<p class="playlist-description line-clamp">${description}</p>
		`;
		return content;
}


/* render user profile */

async function loadUserProfile() {
	const { display_name: displayName, images } = await fetchRequest(ENDPOINT.userinfo);
	
		const profileImg = document.getElementById("user-profile-img");
		const displayNameElement = document.getElementById("user-name");
		
		displayNameElement.textContent = displayName;
		
		// if user profile image
		if (images?.length) {
				profileImg.src = images[0].url;
		}
}


function onPlaylistClick(event, id) {	
		const section = { 
				"type": "playlist",
				"id": id,
				"name": this.getAttribute("name"),
				"img": this.querySelector("img").src,
				"info": this.querySelector(".playlist-description").textContent,
		};
		
		history.pushState(section, "", `playlist/${this.getAttribute("name").replace(/\s/g, "")}`);	
		loadSection(section);
}


async function loadPlaylists(endpoint, sectionId, key) {
		let content = ""; 
		let playlistId = "";
		const playlist = await fetchRequest(endpoint);
		
		const { items } = playlist[key] ?? playlist;
		
		const cardSection = mainContent.querySelector(`#${sectionId} .card-section`);
		
		items.forEach(item => {
				const { name, description, id, images } = item;
				const card = document.createElement("DIV");
				card.classList.add("card", "playlist-card")
				card.id = id;
				card.setAttribute("name", name);
				card.innerHTML = createSectionContent(name, images, description);
				card.addEventListener("click", (event) => onPlaylistClick.call(card, event, id));
								cardSection.insertAdjacentElement("afterbegin", card)
		});
}


function playlists() {		
		loadPlaylists(ENDPOINT.featuredPlaylist, "featured-playlist", "playlists");
		loadPlaylists("me/" + ENDPOINT.playlist, "user-playlist")	;
}


function fillDashboardContent() {
		const playlistMap = new Map([
				["featured", "featured-playlist"],
				["playlist", "user-playlist"]
		]);
		let content = "";
		
		// playlist carousel header
		for (const [type, playlistId] of playlistMap) {
				content += `
						<section id="${playlistId}">
								<h2 class="section-header">${type}</h2>
								<section class="card-section"></section>
						</section>`;
		}
		mainContent.innerHTML = content;
}


async function fillPlaylistContent(playlistId) {
		let playlistTotalTime = 0;
		let content = "";
		let i = 0
	
		const { description, name, images, followers: { total: likesCount }, tracks: { items } } = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
		
		let elem = createSectionContent(history.state.name, history.state.img, history.state.info);
					
		const heroDiv = document.createElement("DIV");
		heroDiv.classList.add("playlist-header");
		heroDiv.insertAdjacentHTML("afterbegin", elem);
		console.log(heroDiv.outerHTML)
		content = `
				<section id="playlist-section">
						${heroDiv.outerHTML}
						<div class="tracks" id="tracks"></div>
				</section>`;
				
		mainContent.innerHTML = content;
		
  const trackSection = document.querySelector("#playlist-section #tracks");
  items.forEach((item) => {
  		const { track: { artists, duration_ms, id, name, preview_url } } = item;
  		if (name !== "") {
  				content = `
  						<div class="track__item" id="${id}">
  								<div class="track__number">${i+1}</div>
  								<div class="track__info">
  										<p class="track__name">${name}</p>
  										<p class="track__artists"></p>
  								</div>
  								<button class="btn">
  										<img class="track__three-dots" src="../icons/three-dots.png" />
  								</button>
  						</div>`;
  				i++;
  				trackSection.insertAdjacentHTML("beforeend", content);
  		}
  })
}


function loadSection(section) {
				if (section.type === SECTIONTYPE.dashboard) {
						fillDashboardContent();	
						playlists();
				} else if (section.type === SECTIONTYPE.playlist) {
						fillPlaylistContent(section.id)
				}
}


logOutBtn.addEventListener("click", logOut);


document.addEventListener("DOMContentLoaded", function() {
		loadUserProfile();	
		
		const section = {
				"type": SECTIONTYPE.dashboard
		};
		history.pushState(section, "", "");				
		loadSection(section);		
		
		window.addEventListener("popstate", (event) => {
						loadSection(event.state);
		})
});
