
document.getElementById('log-in').addEventListener('click', function() {
		var client_id = '6db36a01e85845119836d789ac6c1e61';
		var redirect_uri = 'https://shaikh-danish.github.io/spotify-clone/';
		var scope = 'user-read-private user-read-email';

		var url = 'https://accounts.spotify.com/authorize';
		url += '?response_type=token';
		url += '&client_id=' + 				encodeURIComponent(client_id);
		url += '&scope=' + encodeURIComponent(scope);
		url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
		window.location = url;
		console.log(window.location.href)
});

const hamburger = document.getElementById('hamburger-btn')

hamburger.addEventListener('click', function() {
/*
		let isOpened = hamburger.getAttribute('aria-expanded');
		
		if (isOpened === 'false')
		{
				hamburger.ariaExpanded = 'true';
				//prevent background scrolling
				document.body.style.overflowY = 'hidden';
		}
		else {
				hamburger.ariaExpanded = 'false';
				//enable scrolling
				document.body.style.overflowY = 'visible';
		}
		*/
		
		hamburger.ariaExpanded = hamburger.ariaExpanded === 'false' ? 'true' : 'false';
		
		document.body.style.overflowY = hamburger.ariaExpanded === 'false' ? 'visible' : 'hidden';
});
