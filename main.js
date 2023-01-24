"use strict";

document.addEventListener('DOMContentLoaded', function() {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
				window.location.href = `${APP_URL}/dashboard/dashboard.html`; 
		} else {
				window.location.href = `${APP_URL}/login/login.html`;
		}
});
