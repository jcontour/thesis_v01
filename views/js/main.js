//THIS FILE IS USER INTERACTION STUFF

var app = app || {};

app.main = (function() {

	var init = function(){
		console.log('Initializing app.');
	};

	return {
		init: init,
	};

})();

window.addEventListener('DOMContentLoaded', app.main.init);

