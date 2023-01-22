function fillProfileContent() {
		displayProfile();
}

function displayProfile() {
		const profileSection = document.createElement("section");
	
		profileSection.classList.add("user-section")
		profileSection.id = "user-section";
		profileSection.innerHTML = `
				<div class="user__profile">
						<img src="" alt="user profile icon" class="user__icon">
						<p class="user__name"></p>
				</div>
				<div class="user-section__details">
						<div class="user__followers">
								<p>10</p>
								<p>FOLLOWERS</p>
						</div>
						<div class="user__following">
								<p>10</p>
								<p>FOLLOWING</p>
						</div>
						<div class="user__playlist">
								<p>10</p>
								<p>PLAYLISTS</p>
						</div>
				</div>
				<button>logout</button>
		`;

		insertMainContent(profileSection.outerHTML);
}
