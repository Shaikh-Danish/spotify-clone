"use strict";

function initSearch() {
		const searchBtn = document.getElementById("search-btn");
		const searchBox = document.getElementById("search-box");

		searchBtn.addEventListener("click", function() {
				getTracks(searchBox.value);
		});
}

async function getTracks(searchText) {
		const trackSection = document.querySelector(".track-section");
		const { tracks: { items } } = await fetchRequest(ENDPOINT.search + `/?q=${encodeURIComponent(searchText)}&type=track&limit=10`);
		let trackNo = 1;
		let content = "";
		tracksObj = items;
		
		items.forEach((item, i) => {
				content += generateTracksHtml(item, i, trackNo++);
		});
		trackSection.innerHTML = content;
		addEventOnTracks(trackSection, items);
}

function fillSearchContent() {
		let content = `
				<h2 class="padl-1">Search</h2>
	 		<section class="search flex relative padl-1 padr-1">
	 				<i class="fa fa-solid fa-magnifying-glass absolute search-icon"></i>
	 				<!-- search input box -->
	 				<input id="search-box" class="search-box outline-none border-none" type="text" placeholder="What do you want to listen to?">
	 				<!-- search button -->
	 				<button id="search-btn" class="search-btn border-none">search</button>
	 		</section>
	 		<section class="track-section"></section>
	 `;
	 
	 insertMainContent(content);
		initSearch();
}
