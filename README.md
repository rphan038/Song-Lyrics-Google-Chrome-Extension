# Song-Lyrics-Google-Chrome-Extension

How it works\n
1.) Interfaces with the YouTube Data v3 API with jQuery to obtain JSON data on the current song the user is listening to. \n
2.) Parses and formats appropriate data to send to the Genius lyrics API. \n
3.) Displays obtained lyrics in the extension’s popup page when the extension button on the Google Chrome browser is clicked. \n
4.) Allowed user to submit their own queries to the Genius API if the startup algorithm failed to load correct lyrics.\n

To implement this into your own Google Chrome browser, obtain a YouTube API key, a Genius API key, and insert them into line 23 and line 126 respectively in the popup.js file. Refer to the following resource by Google for a beginner's guide to developing extensions: https://developer.chrome.com/extensions/getstarted
