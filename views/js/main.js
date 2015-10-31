//THIS FILE IS USER INTERACTION STUFF

var app = app || {};

app.main = (function() {

	var getNewChildren = function(id, callback){
		// $.post('/childData', {
		// 	'docid': id
		// }, function(res){
		// 	//WORKING ON THIS ONE RIGHT NOW
		// 	callback(json);
		// })
	}

	var pushArticleInfo = function(title, description){
		$('#title').html('<p>' + title + '</p>');
		$('#description').html('<p>' + description + '</p>');
	}

	var getArticleInfo = function(myId, callback){
		$.post('/article', {
			'docid': myId
		}, function(res){
			callback(res.title, res.description)

		});

	}

	var listen = function(){
		$('.article').click(function(){
			getArticleInfo(this.id, function(title, description){
				pushArticleInfo(title, description);
				getNewChildren(this.id, function(json){
					// make new articleBin with articles for children of this one
				})
			})
		});
	};

	var createArticleBin = function(id){
		var articleBin = $('<div>');
		articleBin.addClass("articleBin").attr("id", id);
		return articleBin;
	}

	var makeInitialElements = function(json){

		var container = $('<div>');
		container.attr("id", "container")
		
		var trendBin = $('<div>');
		trendBin.addClass("articleBin").attr("id", "trend").html('<p>#NationalCatDay</p>')


		var articleBin = $('<div>');
		articleBin.addClass("articleBin").attr("id", "child1");

		for (var i = 0; i < json.children.length; i ++){
			var article = $('<div>');
			article.addClass("article")
					.html('article')
					.attr("id", json.children[i])
			articleBin.append(article);
		}
		
		container.append(trendBin);
		container.append(articleBin);
		$('#viz').append(container)

		listen();
	}

	var getData = function(callback){
		var articles = {};
		console.log("getting data..");
		$.getJSON('/data', function(res){
			articles = res;
			callback(articles);
		});
	}

	var init = function(){
		console.log('Initializing app.');
		getData(function(json){
			makeInitialElements(json);
		});
	};

	return {
		init: init,
	};

})();

window.addEventListener('DOMContentLoaded', app.main.init);

