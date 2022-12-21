"use strict";

/* Select Elements */
const logOutBtn = document.getElementById('log-out');
const profileBtn = document.getElementById("user-option-btn");
const mainContent = document.getElementById("content");
let currentTrack = null;

function timeFormatPlaylist(hour, min) {
		if (min === 60) {
				min = 0;
				++hour;
		}
		
		if (hour >= 1)
				return `${hour}h ${min}min`;
		else if (hour >= 1 && min === 0)
				return `${hour}h`;
		else return `${min}min`;
}

function timeFormatTrack(hour, min, sec) {
		if (sec === 60) {
				sec = 0;
				++min;
		}
		if (hour >= 1) {
				return `
				${String(hour).padStart(2, "0")}:
				${String(min).padStart(2, "0")}:
				${String(sec).padStart(2, "0")}`;
		}
		else {
				return `
				${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}
				`;
		}
}

/* Format time from millisecs to mins and secs */
function formatTime(durationMs, formatFn) {
		let hour = Math.floor(durationMs / 3600000);
		let min = Math.floor(
				((hour >= 1) 
				? durationMs % 3600000
				: durationMs) / 60000);
		let sec = Math.floor((durationMs % 60000) / 1000);
		
		return formatFn(hour, min, sec);
}


function createSectionContent({ name,  images, description }) {
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
	
		const profileImg = document.getElementById("user-profile-icon");
		const displayNameElement = document.getElementById("user-name");
		
		displayNameElement.textContent = displayName;
		
		// if user profile image
		if (images?.length) {
				profileImg.outerHTML = `<img class="img-width" src="${images[0].url}" alt="profile">`;
		}
}


function onPlaylistClick(event, id) {	
		const section = { 
				"type": "playlist",
				"id": id
		};
		
		history.pushState(section, "", `playlist/${name.replace(/\s/g, "")}`);	
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
				card.className = "card playlist-card";
				card.id = id;
				card.innerHTML = createSectionContent(item);
				card.addEventListener("click", (event) => {
						onPlaylistClick(event, id, name);
				});
					cardSection.insertAdjacentElement("afterbegin", card)
		});
}


function playlists() {		
		loadPlaylists(ENDPOINT.featuredPlaylist, "featured-playlist", "playlists");
		loadPlaylists(ENDPOINT.toplists, "top-playlist", "playlists");
		loadPlaylists("me/" + ENDPOINT.playlist, "user-playlist")	;
}


function fillDashboardContent() {
		const playlistMap = new Map([
				["featured", "featured-playlist"],
				["top list", "top-playlist"],
				["playlist", "user-playlist"],
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
	
		const { description, name, images, followers: { total: likesCount }, tracks } = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
		
		mainContent.classList.remove("padding");
		let elem = createSectionContent({ description, name, images });
				
		const heroDiv = document.createElement("DIV");
		heroDiv.className = "playlist-header padding";
		heroDiv.innerHTML = `
				${elem}
				<div class="playlist-followers">
						<p class="playlist-likes">${likesCount.toLocaleString("en-US")} likes</p>
						•
					 <p id="playlist-length" class="playlist-time"></p>	
				</div>
				`;
				
		mainContent.innerHTML = `
				<section id="playlist-section">
						${heroDiv.outerHTML}
						<div class="tracks" id="tracks"></div>
				</section>`;
		
		const playlistTotalTime = loadTracks(tracks);
		document.getElementById("playlist-length").textContent = formatTime(playlistTotalTime, timeFormatPlaylist)
}


function loadTracks( { items } ) {
  
  let trackNo = 1;
  let content = "";
  let playlistTotalTime = 0;
 
  const trackSection = document.querySelector("#playlist-section #tracks");
  
  items.forEach((item) => {
    
  		const { track: { artists, duration_ms, id, name, preview_url } } = item;
  		
 		 const trackDiv = document.createElement("DIV");
 		 trackDiv.className = "track__item padding";
 		 trackDiv.id = id;
 		 
  		if (name !== "") {
  				content = `
  						<div class="track__number">
  								<p>${trackNo++}</p>
  								<i class="fa-solid fa-play fa-lg play-button"></i>
  						</div>
  						<div class="track__info">
  								<p class="track__name line-clamp">${name}</p>
  								<p class="track__artists line-clamp">${Array.from(artists, artist => artist.name).join(", ")}</p>
  						</div>
  						<button class="bg-none track__menu">
  								<i class="fa-solid fa-ellipsis-vertical fa-2xl"></i>
  						</button>`;
  			  				
  			trackDiv.innerHTML = content;
  			trackDiv.addEventListener("click", () => {
  					onTrackClick.call(trackDiv, item.track)
  			});  			
  				trackSection.insertAdjacentElement("beforeend", trackDiv);
  			playlistTotalTime += duration_ms;
  		}
  });
  return playlistTotalTime;
}


function onTrackSelection(id) {
		
}


function onTrackClick( { name, id, duration_ms, artists, album: { images } } ) {
		const trackImg = document.getElementById("track-image");
		const trackName = document.getElementById("track-name");
		const trackArtists = document.getElementById("track-artists");
		const trackDuration = document.getElementById("track-length");
	
	// change current selected track bg-color
		currentTrack?.classList.remove("bg-gray", "selected");
		this.classList.add("bg-gray", "selected");
		currentTrack = this;
		
		trackImg.src = images.find(img => img.height === 64).url;
		trackName.textContent = name;
		trackArtists.textContent = Array.from(artists, artist => artist.name).join(", ");
				
		trackDuration.textContent = "00:30";
}


function loadSection(section) {
				if (section.type === SECTIONTYPE.dashboard) {
						fillDashboardContent();	
						playlists();
						mainContent.classList.add("padding")
				} else if (section.type === SECTIONTYPE.playlist) {
						fillPlaylistContent(section.id)
				}
}


profileBtn.addEventListener("click", function() {		
		profileBtn.ariaExpanded = profileBtn.ariaExpanded === "false" ? "true": "false";
});


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
