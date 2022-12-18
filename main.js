const APP_URL = "https://shaikh-danish.github.io/spotify-clone";
//const APP_URL = "http://127.0.0.1:8080";

document.addEventListener('DOMContentLoaded', function() {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
				window.location.href = `${APP_URL}/dashboard/dashboard.html`; 
		} else {
				window.location.href = `${APP_URL}/login/login.html`;
		}
});
