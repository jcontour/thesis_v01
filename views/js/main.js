
var app = app || {};

app.main = (function() {
	console.log('Your code starts here!');

	var init = function(){
		console.log('Initializing app.');
		
	};

	$.get('/', {}, function(response) {
        	console.log(response);
        	// $('#data').empty();
        	//WHAT DO APPEND ??
        	// $('#data').append('<p>' + response['title'] + '</p>');
	    });

	return {
		init: init,
	};

})();

window.addEventListener('DOMContentLoaded', app.main.init);

