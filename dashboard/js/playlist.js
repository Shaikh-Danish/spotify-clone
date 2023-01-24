async function fillUserPlaylistContent() {
		const { items } = await fetchRequest("me/" + ENDPOINT.playlist);	
		const sectionId = "user-playlist";
		let content = `
				<section id="${sectionId}">
						<section class="card-section flex flex-wrap"></section>
				</section>`;
	
		insertMainContent(content);
		insertPlaylists(sectionId, items);
		addEventOnPlaylist(sectionId);
}
