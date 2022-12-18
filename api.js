async function fetchRequest(endpoint) {
		const creds = createApiConfig(getAccessToken());
		
		const url = `${BASE_API_URL}/${endpoint}`;
		const request = await fetch(url, creds);
		return request.json();
}


function getAccessToken() {
		const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
		const tokenType = localStorage.getItem(TOKEN_TYPE_KEY);
		const expiresIn = localStorage.getItem(EXPIRES_IN_KEY);
		
		//return when token not expired
		if (Date.now() < expiresIn) {
				return { accessToken, tokenType };
		} 
		// access token expired
		else {
				logOut();
		}
}


function createApiConfig({ accessToken, tokenType }, method = "GET") {
		// create configurations for api request
		return {
				headers: {
						Authorization: `${tokenType} ${accessToken}`
				},
				method
		}
}


function logOut() {
		//remove token from local storage
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		localStorage.removeItem(TOKEN_TYPE_KEY);
		localStorage.removeItem(EXPIRES_IN_KEY);
		
		//redirect user to login page
		window.location.href = `${APP_URL}/login/login.html`;
}
