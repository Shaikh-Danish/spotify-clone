const ACCESS_TOKEN_KEY = "access_token";
const TOKEN_TYPE_KEY = "token_type";
const EXPIRES_IN_KEY = "expires_in";
//const APP_URL = "http://127.0.0.1:8080";
const APP_URL = "https://shaikh-danish.github.io/spotify-clone";


const BASE_API_URL = "https://api.spotify.com/v1";

const ENDPOINT = {
		userinfo: "me",
		featuredPlaylist: "browse/featured-playlists?limit=10",
		toplists: "browse/categories/toplists/playlists?limit=10",
		playlist: "playlists",
		search: "search",
		following: "me/following?type=artist"
}
const SECTIONTYPE = {
				dashboard: "dashboard",
				playlist: "playlist",
				search: "search",
				userPlaylist: "user-playlist",
				userProfile: "user-section"
}

function insertMainContent(content) {
		const mainSection = document.getElementById("content");
		mainSection.innerHTML = content;
}
