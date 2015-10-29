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

// var data_cache = {
//     time: new Date(), 
//     data: {}
// };

var db = mongoclient.db('thesis');

function getDataArray(data_obj, callback){

    //data array creation
    var query = {}
    var projection = {title: 1, keywords: 1}
    var numDocs = 0; 

    db.collection('segue').find(query, projection).each(function(err, doc) {
        if (err) throw err;
        if (doc == null){
            callback(data_obj, numDocs);
        } else {
            data_obj[numDocs] = {'keywords': doc.keywords, 'id': doc._id};
            numDocs ++;
        }
    });
}
function getTrendArray(trend_array, callback){
    // //trend array creation
    db.collection('trend').findOne({}, {keywords: 1, _id: 0}, function(err, doc){
        if (err) throw err;
        trend_array = doc.keywords;
        callback(trend_array);
    })

}


function compareData(filled_data_obj, numDocs, filled_trend_array, callback){
    console.log("comparing data");

    // console.log(filled_data_obj);
    var comparedData = {};

    for (var i = 0; i < filled_trend_array.length; i++){
        //filling object with key:emptyArray pairs for each keyword
        comparedData[filled_trend_array[i]] = [];

        for(var j = 0; j < numDocs; j++){

            console.log(typeof filled_data_obj[j])
            for(var k = 0; k < filled_data_obj[j].keywords.length; k++){
                // console.log(filled_data_obj[j].keywords[k]);
                console.log(filled_trend_array[i], filled_data_obj[j].keywords[k]);
                if (filled_trend_array[i] == filled_data_obj[j].keywords[k]){
                    console.log("match found!");
                    if ()
                    comparedData[filled_trend_array[i]].push(filled_data_obj[j].id);
                } else {
                    console.log("no match for: " + filled_trend_array[i]);
                }
            }
        }
    }

    callback(comparedData);
}

function getData(data_obj, trend_array, callback){

    getDataArray(data_obj, function(filled_data_obj, numDocs){
        getTrendArray(trend_array, function(filled_trend_array){
            compareData(filled_data_obj, numDocs, filled_trend_array, function(comparedDataObj){
                callback(comparedDataObj);
            })
        })
    })
}

app.get('/data', function(req, res){
    var data_obj = {};
    var trend_array;
    getData(data_obj, trend_array, function(comparedDataObj){
        res.json(comparedDataObj);
    })
})

app.get('/', function(req, res){

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
