var express = require('express'), 
    app = express(),
    fs = require('fs'),
    cons = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;
    

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views'));

var mongoclient = new MongoClient(new Server("localhost", 27017));
var data_cache = {
    time: new Date(), 
    data: {}
};
var db_thesis = mongoclient.db('thesis');
var db_tag_matching = mongoclient.db('tag_matching');

app.get('/', function(req, res){

    if (data_cache.data == {} || data_cache.time < new Date - 1 day) {
        //data array creation
        var query = {}
        var projection = {title: 1, keywords: 1}
        var data_cursor = db_thesis.collection('segue').find(query, projection);
        var data_array = [];
    
        data_cursor.each(function(err, doc) {
            if (err) throw err;
            if (doc == null){
                for (var i = 0; i < data_array.length; i++){
                    console.log(i + " " + data_array[i]);
                }
                db_thesis.close()
            }
            data_array.push(JSON.stringify(doc));
        });
    
        //trend array creation
        var trend_cursor = db_thesis.collection('trend').findOne({}, {keywords: 1, _id: 0});
        var trend_array = []
        trend_cursor.each(function(err, doc){
            if (err) throw err;
            if (doc == null){
                for (var i = 0; i < trend_array.length; i++){
                    console.log(i + " " + trend_array[i]);
                }
                db_thesis.close();
            } 
            trend_array.push(JSON.stringify(doc));
        })
        
        data_cache.data = data_array;
        data_cache.time = new Date();
    } 
    
    
    res.json(data);
    

    //render view
    res.render('viz1')
});

app.get('*', function(req, res){
    res.send('Page Not Found', 404);
});

mongoclient.open(function(err, mongoclient) {

    if(err) throw err;

    app.listen(8080);
    console.log('Express server started on port 8080');
});
