"use strict";

let currentTrack = null;
let currentSection = document.getElementById("dashboard");
let tracksObj = {};

// track progress bar for mobile and desktop
const trackProgressBarMob = document.getElementById("progress-bar-mobile");
const trackProgressBar = document.getElementById("track-progress-bar");
const trackPlayElMob = document.getElementById("song-play-btn-mob");
const trackPlayEl = document.getElementById("song-play-btn");

const audio = new Audio();


document.addEventListener("DOMContentLoaded", function() {
		loadUserProfile();	
		
		const section = {
				"type": "dashboard"
		};
		
		history.pushState(section, "", "");	
		loadSection(section);
		
		window.addEventListener("popstate", (event) => {
						loadSection(event.state);
		});
});

// render user profile 
async function loadUserProfile() {
	 const { display_name, images, followers } = await fetchRequest(ENDPOINT.userinfo);
	 
		const profileImg = document.getElementById("user-icon");
		const displayNameEl = document.getElementById("user-name");
		
		displayNameEl.textContent = display_name;		
		if (images?.length) {
				profileImg.outerHTML = `<img class="img-width" src="${images[0].url}" alt="profile">`;
				localStorage.setItem("user_url", images[0].url);
		}
		
		localStorage.setItem("user_name", display_name);
		localStorage.setItem("user_follower", followers.total);
		console.log(localStorage)
}

function loadSection(section) {
		if (section.type === SECTIONTYPE.dashboard) {
				fillDashboardContent();	
		} else if (section.type === SECTIONTYPE.playlist) {
				fillPlaylistContent(section.id)
		} else if (section.type === SECTIONTYPE.search) {
				fillSearchContent();
		} else if (section.type === SECTIONTYPE.userPlaylist) {
				fillUserPlaylistContent();
		} else if (section.type === SECTIONTYPE.userProfile) {
				//fillProfileContent();
				fillProfileContent();
		} 
}

function fillDashboardContent() {
		const sectionsTitle = new Map([
				["featured", "featured-playlist"],
				["top list", "top-playlist"]
		]);
		let content = ""
		
		// playlist carousel header
		for (const [type, playlistId] of sectionsTitle) {
				content += `
						<section id="${playlistId}">
								<h2 class="section-header">${type}</h2>
								<section class="card-section flex"></section>
						</section>`;
		}
		insertMainContent(content);
		loadPlaylists();
}

async function loadPlaylists() {
		const playlistEndpoint = new Map([
				["featured-playlist",  ENDPOINT.featuredPlaylist],
				["top-playlist", ENDPOINT.toplists]
		]);
		
		for (const [sectionId, endpoint] of playlistEndpoint) {
				const { playlists: { items } } = await fetchRequest(endpoint);	
				insertPlaylists(sectionId, items);
				addEventOnPlaylist(sectionId);
		}
}

function insertPlaylists(sectionId, playlistItems) {
		const cardSection = document.querySelector(`#${sectionId} .card-section`);
		let content = "";
		
		playlistItems.forEach(item => {
				content += generatePlaylistHtml("card", item);
		});
		
		cardSection.innerHTML = content;
}

function generatePlaylistHtml(type, { name,  images, description, followers, id = "" }) {
		try {
				return `
						<div class="${type} flex flex-column" id="${id}">
								<img src="${(images[0].url ?? images)}" alt="${name}" class="playlist-img">
								<p class="playlist-name line-clamp line-clamp-1">${name}</p>
								<p class="playlist-description line-clamp line-clamp-2 clr-secondary">${description}</p>
								<p id="playlist-likes" class="playlist-likes clr-secondary"></p>
						</div>
				`;
		} catch (err) {
				return "";
		}
}

function addEventOnPlaylist(sectionId) {
		const playlistSection = document.querySelector(`#${sectionId} .card-section`);
		
		playlistSection.addEventListener("click", (e) => {
				const currentEl = e.target.parentElement
		
			 if (currentEl.classList.contains("card")) {
						onPlaylistClick(currentEl);
				}
		});
}

function onPlaylistClick(currentEl) {	
		const section = { 
				type: "playlist",
				id: currentEl.id
		};
		history.pushState(section, "", "");	
		loadSection(section);
}

async function fillPlaylistContent(playlistId) {
		const response = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
		const mainSection = document.getElementById("content");
		let elem = generatePlaylistHtml("playlist-header", response);
		tracksObj = response.tracks;
	 
		mainSection.classList.remove("padding");
		mainSection.innerHTML = `
				<section id="playlist-section">
						${elem}
						<div class="tracks" id="tracks"></div>
				</section>`;
		
		const playlistTotalTime = loadTracks(tracksObj);
		console.log(playlistTotalTime)
		playlistLikesTimeHtml(response.followers.total, playlistTotalTime);
		initSongControls();
}

function loadTracks( { items } ) {
  
  const trackSection = document.querySelector("#playlist-section #tracks");
  
  let trackNo = 1;
		let playlistTime = 0;

		items.forEach((item, i) => {   
				if (item.track && item.track.name !== "" && item.track.preview_url !== null) {
  				trackSection.innerHTML += generateTracksHtml(item.track, i, trackNo++);
  				playlistTime += item.track.duration_ms;
  		}
  });
  addEventOnTracks(trackSection, items);
  return playlistTime;
}

function addEventOnTracks(trackSection, tracksObj) {
		
		trackSection.addEventListener("click", (e) => {
  		const currentEl = e.target.offsetParent;
  		const trackNo = currentEl.getAttribute("data-track-no");  		
  		const trackObj = tracksObj[trackNo].track ?? tracksObj[trackNo];
  
  		if (currentEl.classList.contains("track__item"))
  		{
  				onTrackClick.call(currentEl, trackObj);
  		}
  });
}

function onTrackClick({ name, id, duration_ms, artists, preview_url, album }) {
		const trackImg = document.getElementById("track-image");
		const trackName = document.getElementById("track-name");
		const trackArtists = document.getElementById("track-artists");

		const img = album.images.find(img => img.height === 64).url;
	 artists = Array.from(artists, artist => artist.name).join(", ");
	 
	// change current selected track bg-color
		currentTrack?.classList.remove("bg-gray", "selected");
		this.classList.add("bg-gray", "selected");
		currentTrack = this;
		
		trackImg.src = img;
		trackName.textContent = name;
		trackArtists.textContent = artists;
		
		initAudio(preview_url);
}

function initAudio(url) {
		audio.src = url;		
		audio.pause();
		
		audio.removeEventListener("loadedmetadata", trackMetaDataLoaded)
		audio.addEventListener("loadedmetadata", trackMetaDataLoaded);
		
		audio.play();
		trackPlayEl.classList.add("playing");
		trackPlayElMob.classList.add("playing");
		setInterval(trackTime, 100);
}

function trackMetaDataLoaded() {
		const trackDuration = document.getElementById("track-length");
		
		const { min, sec } = getFormatTime(audio.duration*1000)
		trackDuration.textContent = formatTimeTrack(min, sec);
}

function trackTime() {
		const trackTimeCompleted = document.getElementById("track-time-completed");
		const { min, sec } = getFormatTime(audio.currentTime*1000);
		
		trackTimeCompleted.textContent = formatTimeTrack(min, sec);
		
		//set inset width as current audio time progresses
		trackProgressBar.style.boxShadow = `inset ${(trackProgressBar.clientWidth / audio.duration)*audio.currentTime}px 0 var(--clr-primary)`;
		
		trackProgressBarMob.style.boxShadow = `inset ${(trackProgressBarMob.clientWidth / audio.duration)*audio.currentTime}px 0 var(--clr-primary)`;
}

function generateTracksHtml({ name, id, artists, duration_ms, preview_url }, i, trackNo) {
		const { min, sec } = getFormatTime(duration_ms);
		const trackArtists = Array.from(artists, artist => artist.name).join(", ");
		return `
  		<div
  				class="track__item flex align-center clr-secondary relative padding"
  				id="${id}"
  				data-track-no="${i}">
  				<div class="track__number">
  						<p>${trackNo}</p>
  						<i class="fa-solid fa-play fa-lg play-button"></i>
  				</div>
  				<div class="track__info">
  						<p class="track__name clr-primary line-clamp line-clamp-1">${name}</p>
  						<p class="track__artists line-clamp line-clamp-1">${trackArtists}</p>
  				</div>
  				<div class="track__duration">${formatTimeTrack(min, sec)}</div>
  		</div>`;
}

function playlistLikesTimeHtml(likes, time) {	
		const { hour, min } = getFormatTime(time);
		const playlistLike = document.querySelector("#playlist-likes");
		
		playlistLike.textContent = `${likes.toLocaleString("en-US")} likes • ${formatTimePlaylist(hour, min)}`;
}

function initSongControls(tracksObj) {
		const nextTrackBtn = document.getElementById("next-track");
		const prevTrackBtn = document.getElementById("prev-track");
		
		nextTrackBtn.addEventListener("click", () => playNewTrack("next"));
		prevTrackBtn.addEventListener("click", () => playNewTrack("prev"));
}

function playNewTrack(name) {
		const tracksEl = getAdjacentTracks()[name];
		const obj = getNewTrackObj(tracksEl);
		onTrackClick.call(tracksEl, obj);
}

function getAdjacentTracks() {
		return {
				next: currentTrack.nextElementSibling,
				prev: currentTrack.previousElementSibling
		}
}

function getNewTrackObj(track) {
		const trackNo = track.getAttribute("data-track-no");
		if (tracksObj[trackNo]) return tracksObj[trackNo];
		return tracksObj.items[trackNo].track;
}

function pageNavigation(navEl) {
		const section = {};
		
		if (navEl.classList.contains("nav__item")) {
				const isClicked = navEl.classList.contains("active");
				
				if (navEl.id && !isClicked) {
						section.type = navEl.id;
				}			
				
  		currentSection.classList.remove("active");
				currentSection = navEl;
				navEl.classList.add("active");
				history.pushState(section, "", "");
				loadSection(section);
		}
}

trackPlayEl.addEventListener("click", function() {
		stopStartTrack();
});

trackPlayElMob.addEventListener("click", function() {
		stopStartTrack();
});

function stopStartTrack() {
		if (trackPlayEl.classList.contains("playing") || trackPlayElMob.classList.contains("playing")) {
				audio.pause();
				trackPlayEl.classList.remove("playing");
				trackPlayElMob.classList.remove("playing")
		} else {
				trackPlayEl.classList.add("playing");
				trackPlayElMob.classList.add("playing")
				audio.play();
		}
}

(() => {
		const logOutBtn = document.getElementById('log-out');
		const profileBtn = document.getElementById("user-option-btn");
		const navSection = document.getElementById("nav-items");
		const volumeSlider = document.getElementById("volume-slider");
		
		profileBtn.addEventListener("click", async function() {		
				profileBtn.ariaExpanded = profileBtn.ariaExpanded === "false" ? "true": "false";
				//fillDashboardContent()
				let res = await fetchRequest("me/player");
				console.log(res)
				res = await fetchRequest("me/player/currently-playing");
				console.log(res)
		});
		
		logOutBtn.addEventListener("click", logOut);
		
		volumeSlider.addEventListener("input", function() {
				audio.volume = volumeSlider.value / 100;
		});
		
		navSection.addEventListener("click", function(e) {
				const navItem = e.target.offsetParent;
				pageNavigation(navItem);
		});
})();

function formatTimePlaylist(hour, min) {
		if (hour === 0) return `${min}min`
		else if (min === 0) return `${hour}h`
		return `${hour}h ${min}min`
}

//create string in 00:00 time format
function formatTimeTrack(min, sec) {
		return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

//format time from milliseconds to hour, kin and sec
function getFormatTime(durationMs) {
		const trackTime = new Date(Date.UTC(0, 0, 0, 0, 0, 0, durationMs));
		return {
    hour: trackTime.getUTCHours(),
    min: trackTime.getUTCMinutes(),
    sec: trackTime.getUTCSeconds()
  }
}
