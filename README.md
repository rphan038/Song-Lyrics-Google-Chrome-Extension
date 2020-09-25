# Song-Lyrics-Google-Chrome-Extension

About

This is a Google Chrome Extension that you can use when listening to music on YouTube that will load lyrics into the extension's popup page when you click the extension button. There are options to search for the correct song if the startup algorithm fails.

How it works

1.) Interfaces with the YouTube Data v3 API with jQuery to obtain JSON data on the current song the user is listening to.

2.) Parses and formats appropriate data to send to the Genius lyrics API.

3.) Displays obtained lyrics in the extension’s popup page when the extension button on the Google Chrome browser is clicked.

4.) Allowed user to submit their own queries to the Genius API if the startup algorithm failed to load correct lyrics.

To implement this into your own Google Chrome browser, obtain a YouTube API key, a Genius API key, and insert them into line 23 and line 126 respectively in the popup.js file. You will also need to create an images directory in this main directory containing images for your extension button. Refer to the following resource by Google for a beginner's guide to developing extensions: https://developer.chrome.com/extensions/getstarted
