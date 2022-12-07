document.addEventListener('DOMContentLoaded', function() {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
				window.location.href = 'http://localhost:8080/dashboard/dashboard.html'; 
		} else {
				window.location.href = 'http://localhost:8080/login/login.html';
		}
});
