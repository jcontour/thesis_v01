//THIS FILE IS USER INTERACTION STUFF

var app = app || {};

app.main = (function() {

	var getNewChildren = function(id, callback){
		$.post('/childData', {
			'docid': id
		}, function(res){
			callback(res);
		})
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

	var createChildBin = function(parent_id, id_array){
		id_array.splice(id_array.indexOf(parent_id),1);

		var articleBin = $('<div>');
		articleBin.addClass("articleBin").attr("id", "child2");

		for (var i = 0; i < id_array.length; i ++){
			var article = $('<div>');
			article.addClass("article")
					.attr("id", id_array[i])
			articleBin.append(article);
		}
		$('#container').append(articleBin);

		listen();
	}

	var listen = function(){
		$('#child1 > .article').click(function(){
			var articleID = this.id;

			getArticleInfo(articleID, function(title, description){
				pushArticleInfo(title, description);
				
				//create new article Bin with matching children articles for this one
				getNewChildren(articleID, function(matching_ids){
					if ($('#child2').length > 0){
						$('#child2').remove();
					}
					createChildBin(articleID, matching_ids);
				})
			})
		});

		$('#child2 > .article').click(function(){
			var articleID = this.id;

			getArticleInfo(articleID, function(title, description){
				pushArticleInfo(title, description);
				
			})
		});
	};


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

