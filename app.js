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

function getChildArray(child_obj, callback){
    console.log("getting child array")

    //data array creation
    var query = {}
    var projection = {title: 1, keywords: 1}
    var numDocs = 0; 

    db.collection('segue1').find(query, projection).each(function(err, doc) {
        if (err) throw err;
        if (doc == null){
            callback(child_obj, numDocs);
        } else {
            child_obj[numDocs] = {'keywords': doc.keywords, 'id': doc._id};
            numDocs ++;
        }
    });
}
function getParentArray(parent_array, callback){
    console.log("getting parent array")
    // //trend array creation
    db.collection('trend1').findOne({}, {keywords: 1, _id: 0}, function(err, doc){
        if (err) throw err;
        parent_array = doc.keywords;
        callback(parent_array);
    })

}


function compareData(filled_child_obj, numDocs, filled_parent_array, callback){
    console.log("comparing data");

    // console.log(filled_child_obj);
    var comparedData = {};

    for (var i = 0; i < filled_parent_array.length; i++){
        //filling object with key:emptyArray pairs for each keyword
        comparedData[filled_parent_array[i]] = [];

        for(var j = 0; j < numDocs; j++){

            // console.log(typeof filled_child_obj[j])
            for(var k = 0; k < filled_child_obj[j].keywords.length; k++){
                // console.log(filled_child_obj[j].keywords[k]);
                //console.log(filled_parent_array[i], filled_child_obj[j].keywords[k]);
                if (filled_parent_array[i] == filled_child_obj[j].keywords[k]){
                    // console.log("match found!");
                    comparedData[filled_parent_array[i]].push(filled_child_obj[j].id);
                } else {
                    // console.log("no match for: " + filled_parent_array[i]);
                }
            }
        }
    }

    callback(filled_parent_array, comparedData);
}

function getChild(child_obj, parent_array, callback){

    console.log("assembling data");
    getChildArray(child_obj, function(filled_child_obj, numDocs){
        getParentArray(parent_array, function(filled_parent_array){
            compareData(filled_child_obj, numDocs, filled_parent_array, function(filled_parent_array, comparedDataObj){
                callback(filled_parent_array, comparedDataObj);
            })
        })
    })
}

function getJSON(callback){
    
    var child_obj = {};
    var parent_array;

    getChild(child_obj, parent_array, function(filled_parent_array, comparedDataObj){
        
        //do the stuff to make this obj into good json for d3
        //comparedDataObj > response_json
        console.log("getting json");

        json_obj = {
                'name': filled_parent_array[0],
                'parent': 'null',
                'children': []
        }

        for (var i = 0; i < filled_parent_array.length; i++){
            //loop through keys in compared obj
            if (comparedDataObj[filled_parent_array[i]].length > 0){
                //check if there's id's in them
                for (var j = 0; j < comparedDataObj[filled_parent_array[i]].length; j++){
                    //push id's into json obj's child array
                    json_obj['children'].push({'name': comparedDataObj[filled_parent_array[i]][j], 'parent': filled_parent_array[0]})
                }
            }
        }

        console.log(json_obj);

        callback(json_obj)
    })
}

app.get('/data', function(req, res){
    
    //run function to get json for d3
    getJSON(function(response_json){
        res.write(JSON.stringify(response_json));
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
