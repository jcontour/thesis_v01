
var app = app || {};

app.main = (function() {

	var parseData = function(trendArray, dataArray){
		//get arrays from app.js
		$.get('/', function(res){

		})
		//loop if trend[i] == data[j].keywords[k]
		//add data[j]._id to child of trend
	}

	var init = function(){
		console.log('Initializing app.');

	};

	return {
		init: init,
		parseData : parseData
	};

})();

window.addEventListener('DOMContentLoaded', app.main.init);

