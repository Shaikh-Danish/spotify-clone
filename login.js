'use strict';

const logInBtn = document.getElementById('log-in');
const APP_URL = 'https://shaikh-danish.github.io/spotify-clone`;
const CLIENT_ID = '6db36a01e85845119836d789ac6c1e61';
const REDIRECT_URI = `${APP_URL}/index.html`;
const scope = 'user-read-private user-read-email';
const TOKEN_PARAM_KEYS = ['access_token', 'token_type', 'expires_in'];
let logIn = true;


function spotifyLogIn() {
		let url = 'https://accounts.spotify.com/authorize';
		url += '?response_type=token';
		url += '&client_id=' + 				encodeURIComponent(CLIENT_ID);
		url += '&scope=' + encodeURIComponent(scope);
		url += '&redirect_uri=' + encodeURIComponent(REDIRECT_URI);
		//window.location = url;
		window.open(url, 'login', 'width=400, height=600');
		logIn = true;
}

function getUrlParams(hash) {
		const urlParams = new URLSearchParams(hash);
		
		return TOKEN_PARAM_KEYS.map((key) => urlParams.get(key))
}

function setItemsInLocalStorage(...tokens) {
		tokens.forEach((currToken, i) => {
				localStorage.setItem(TOKEN_PARAM_KEYS[i], currToken);
		});
}

logInBtn.addEventListener('click', spotifyLogIn);


document.addEventListener('DOMContentLoaded', function() {
		if (logIn) {
				const hash = window.location.hash.replace('#', '?');
				const [accessToken, tokenType, expiresIn] = getUrlParams(hash);
				const access_Token = localStorage.getItem(TOKEN_PARAM_KEYS[0]);
		
				if (access_Token) {
						window.location.href = `${APP_URL}/dashboard/index.html`;
						return ;
				}	
				if (accessToken) {	
						window.close();		
						setItemsInLocalStorage(accessToken, tokenType, expiresIn);
						window.location.href = `${APP_URL}/dashboard/index.html`;
				}
				else {
						window.close();
				}		
				logIn = false;
		}
});


/* 
Let's build a simple poll app!

A poll has a question, an array of options from which people can choose, and an array with the number of replies for each option. This data is stored in the starter object below.

Here are your tasks:

1. Create a method called 'registerNewAnswer' on the 'poll' object. The method does 2 things:
  1.1. Display a prompt window for the user to input the number of the selected option. The prompt should look like this:
        What is your favourite programming language?
        0: JavaScript
        1: Python
        2: Rust
        3: C++
        (Write option number)
  
  1.2. Based on the input number, update the answers array. For example, if the option is 3, increase the value AT POSITION 3 of the array by 1. Make sure to check if the input is a number and if the number makes sense (e.g answer 52 wouldn't make sense, right?)
2. Call this method whenever the user clicks the "Answer poll" button.
3. Create a method 'displayResults' which displays the poll results. The method takes a string as an input (called 'type'), which can be either 'string' or 'array'. If type is 'array', simply display the results array as it is, using console.log(). This should be the default option. If type is 'string', display a string like "Poll results are 13, 2, 4, 1". 
4. Run the 'displayResults' method at the end of each 'registerNewAnswer' method call.

HINT: Use many of the tools you learned about in this and the last section 😉

BONUS: Use the 'displayResults' method to display the 2 arrays in the test data. Use both the 'array' and the 'string' option. Do NOT put the arrays in the poll object! So what shoud the this keyword look like in this situation?

BONUS TEST DATA 1: [5, 2, 3]
BONUS TEST DATA 2: [1, 5, 3, 9, 6, 1]

GOOD LUCK 😀
*/

/*
const poll = {
  question: 'What is your favourite programming language?',
  
  options: ['0: JavaScript', '1: Python', '2: Rust', '3: C++'],
  
  answers: new Array(4).fill(0),
  
  registerNewAnswer() {
  		const answer = Number(prompt(`${this.question}\n\n\t${this.options.join('\n\t')}\n(write option number)`));
  		if (typeof answer === 'number' && answer < this.answers.length) {
  				this.answers[answer]++;
  		}
  }
}
poll.registerNewAnswer();
*/
