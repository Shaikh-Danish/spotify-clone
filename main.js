
document.getElementById('log-in').addEventListener('click', function() {
		
		var client_id = '1360b7537f904ce898c837bb43690dcf';
		var redirect_uri = 'http://localhost:8000/callback/';
		
		/*
		var client_id = '6db36a01e85845119836d789ac6c1e61';
		var redirect_uri = 'https://shaikh-danish.github.io/spotify-clone/';
		*/

		var scope = 'user-read-private user-read-email';

		var url = 'https://accounts.spotify.com/authorize';
		url += '?response_type=token';
		url += '&client_id=' + 				encodeURIComponent(client_id);
		url += '&scope=' + encodeURIComponent(scope);
		url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
		/*query = window.open(url);
		console.log(query);*/
		this.href = url;
		console.log(url)
		this.textContent = url;
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
