var song = document.querySelector(".song-title > p");
var vidTitle = '';
var chanTitle = '';

gettingYouTubeJSON();

/**
 *	@brief Uses the YouTube link the user is on to gain data about what song they are listening to
 */
function gettingYouTubeJSON() {
	chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
		//YouTube video ID can be obtained by separating the URL by '&' and saving what's after '?v='
		//Example: https://www.youtubee.com/watch?v=VIDEOIDHERE&other_parameter=parameter
		let _url = tabs[0].url;
		var tmp = _url.split('&');
		let vidID = tmp[0].substr(32);
		//This is for if the user is using YouTube's dedicated music site
		//Example: https://music.youtube.com/watch?v=VIDEOIDHERE
		if(_url.includes('music')) {
			vidID = tmp[0].substr(34);
		}
		//Sets up parameters needed to communicate to YouTube API
		var key = 'your_key';
		var URL = 'https://www.googleapis.com/youtube/v3/videos';

		var options = {
			part: 'snippet',
			key: key,
			id: vidID,
			videoCategoryId: 10
		}
		//Asks YouTube API for read only data and saves what is needed
		//Formats the new data and then sends the formatted data to the Genius lyrics API
		$.getJSON(URL, options, function(data) {
			if(data.items.length === 0) {
				$('main').empty();
				$('main').append(`<p>No Results </p>`);
				return;
			}
			vidTitle = data.items[0].snippet.title;
			chanTitle = data.items[0].snippet.channelTitle;
			//Format string
			var s = formatString(vidTitle);
			//Send formatted string to Genius API
			searchSong(s);
		});
	});
}

/**
 *  @brief The video title has a lot of punctuation marks and unnecessary words that can confuse to
 *	the Genius API when a request is queried. This function formats the string so that it is
 * 	compatible with the Genius API format
 *	@param q The string to be formated
 *	@return The new string encoded in UTF-8 format in the case that foreign languages are in the string
 */
function formatString(q) {
	var nq = '';
	//Removes all punctuations, brackets, and parentheses as well as content inside of them
	for(var i = 0; i < q.length; i++) {
		if(q[i] === '[') {
			i++;
			while(q[i] !== ']' && i < q.length)
				i++;
			i++;
		} else if(q[i] === 'V' && nq[nq.length - 1] === 'M') {
			nq = nq.substr(0, nq.length - 1);
			i++;
			if(q[i] === ']' || q[i] === ')')
				i++;
		} else if(q[i] === '(' && q[i - 1] !== ' ') {
			i++;
			while(q[i] !== ' ' && i < q.length)
				i++;
			i--;
		} else if(q[i] !== '(' && q[i] !== ')' && q[i] !== '_' && q[i] !== "'" && q[i] !== '/' && q[i] !== '"' && q[i] !== ':') {
			nq = nq.concat(q[i]);
		}
	}
	//Removes unnecessary words
	var h = nq.includes("feat");
	var b = nq.includes("Feat");
	var a = nq.includes("FEAT");
	var c = nq.includes("Official");
	var d = nq.includes("Video");
	if(h) {
		nq = nq.replace("feat", '');
	} else if(b) {
		nq = nq.replace("Feat", '');
	} else if(a) {
		nq = nq.replace("FEAT", '');
	}
	if(c)
		nq = nq.replace("Official", '');
	if(d)
		nq = nq.replace("Video", '');
	return encodeURIComponent(nq);
}

/**
 *	@brief Goes to the URL of the Genius page containing a specifc lyrics to the song and finds
 *	the DOM element that contains the lyrics. Obtains the lyrics and displays them in the popup html page
 *	@param songURL The URL to the lyrics of the song
 */
function getLyrics(songURL) {
	$.ajax({url: songURL, success: function(data){
		var lyricHTML = $(data).find('p').html();

		$('main').empty();
		$('main').append(`
			<p>
			${lyricHTML}
			</p>
		`);
	}});
}

var happened = false;

/**
 *	@brief Queries the Genius API with the song title to try and find lyrics. Also obtains other
 * 	possible searchresults in case the first option is incorrect
 *	@param link The encoded search query component that will be included in the link
 */
function searchSong(link) {
	var fullLink = "https://api.genius.com/search?q=" + link + "&access_token=your_access_token";
	$(document).ready(function() {
		//Queries Genius API
		$.getJSON(fullLink, function(data) {
			//Reformats string to look for other possible results if the initial search 
			//doesn't have any results
			if(data.response.hits.length === 0 && !happened) {
				var tmp = vidTitle;
				var regex = /[^a-z0-9_ ]/i;
				for(var i = 0; i < tmp.length; i++) {
					if(tmp[i] === '[') {
						i++;
						while(tmp[i] !== ']' && i < tmp.length)
							i++;
						i++;
					} 
					if((regex.test(tmp[i]))) {
						tmp = tmp.replace(tmp[i], '');
						i--;
					}
				}
				happened = true;
				searchSong(formatString(tmp));
				return;
			} else if(data.response.hits.length === 0 && happened) {
				$('main').empty();
				$('main').append(`<p>No Results</p>`);
				return;
			}
			//Looks in the given JSON file and saves data that's needed
			var URL = data.response.hits[0].result.url;
			var title = data.response.hits[0].result.full_title;
			song.innerHTML = title;

			//Goes into the actual lyrics page and obtains the lyrics from there
			getLyrics(URL);

			//If the lyrics obtained is incorrect, displays other likely song options
			//ie Multiple songs can have the same name so the user can click on the correct song
			$(`#options`).empty();
			for(var i = 1; i < 4; i++) {
				if(i >= data.response.hits.length)
					break;
				let t = data.response.hits[i].result.full_title;
				$(`<div style="color: blue;" id="${t}"><u>-${t}</u></div>`).appendTo(`#options`);
				document.getElementById(t).addEventListener('click', () => f(t));
			}
		});
	});
}

/**
 *	@brief Helper function for the click events in the div tag with id=options. Clicking on these
 *	will load the new lyrics with respect to what has been clicked
 */
function f(str) {
	var m = formatString(str);
	searchSong(m);
}

//Event listener for when the user uses the search bar to search for lyrics
document.getElementById('searchb').addEventListener('click', function() {
	var x = document.getElementById('searchq').value;
	searchSong(formatString(x));
});

var clicked = false;

//Event listener for the Search Again function. Many video titles on YouTube have "- Topic"
//in their title so this event listener removes this from the query string and runs the search algorithm again
document.getElementById('try_again').addEventListener('click', function(element) {
	var n = chanTitle.includes("- Topic");
	if(n) {
		chanTitle = chanTitle.replace("- Topic", "");
	} else {
		chanTitle = chanTitle.concat(' ');
	}
	chanTitle = chanTitle.concat(vidTitle);
	happened = false;
	clicked = true;
	var s = formatString(chanTitle);
	searchSong(s);
});