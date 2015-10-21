/* Your code starts here */

var app = app || {};

app.main = (function() {
	console.log('Your code starts here!');

	var init = function(){
		console.log('Initializing app.');
		
	};

	return {
		init: init
	};

})();

window.addEventListener('DOMContentLoaded', app.main.init);

//Look at database of articles
//Compare tags to find connections
//Use d3.js to create amazing visualization
//when someone clicks on an article, popup split screen view
//when hover on nodes, show article names
