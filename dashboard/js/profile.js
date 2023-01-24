function fillProfileContent() {
		displayProfile();
}

async function displayProfile() {
		const res = await getUser();
		let profileHtml = generateProfileHtml(res);
		insertMainContent(profileHtml);
}

async function getUser() {
		const { items } = await fetchRequest("me/" + ENDPOINT.playlist);
		const { artists: { items: following } } = await fetchRequest(ENDPOINT.following);
	//console.log(localStorage)
		return {
				user: localStorage.getItem("user_name"),
				imgUrl: localStorage.getItem("user_url"),
				followerCount: localStorage.getItem("user_follower"),
				playlistCount: items.length,
				followingCount: following.length
		}
}

function generateProfileHtml({ user, follower, imgUrl, playlistCount, followerCount, followingCount }) {
		//console.log(user);
		//console.log(follower)
		let imgHtml = `<i id="user-icon" class="fa-regular fa-user user__icon"></i>`;
		
		if (imgUrl) {
				imgHtml = `<img src="${imgUrl}" alt="user profile icon" class="user__icon">`
		}
		
		return `
				<section class="user-section" id="user-section">
						<div class="user__profile">
								${imgHtml}
								<p class="user__name">${user}</p>
						</div>
						<div class="user-section__details clr-secondary">
								<div class="user__followers">
										<p id="follower-count">${followerCount}</p>
										<p>FOLLOWERS</p>
								</div>
								<div class="user__following">
										<p id="following-count">${followingCount}</p>
										<p>FOLLOWING</p>
								</div>
								<div class="user__playlist">
										<p id="playlist-count">${playlistCount}</p>
										<p>PLAYLISTS</p>
								</div>
						</div>
						<button class="logout-btn bg-none clr-primary" onclick="logOut()">logout</button>
				</section>
		`;
}
