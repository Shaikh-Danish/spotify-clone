function insertMainContent(content) {
		const mainSection = document.getElementById("content");
		mainSection.innerHTML = content;
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
		return `
				<div class="${type} flex flex-column" id="${id}">
						<img src="${(images[0].url ?? images)}" alt="${name}" class="playlist-img">
						<p class="playlist-name line-clamp line-clamp-1">${name}</p>
						<p class="playlist-description line-clamp line-clamp-2 clr-secondary">${description}</p>
						<p id="playlist-likes" class="playlist-likes clr-secondary"></p>
				</div>
		`;
}

function onPlaylistClick(playlistId) {	
		const section = { 
				type: "playlist",
				id: playlistId
		};
		history.pushState(section, "", "");	
		loadSection(section);
}
