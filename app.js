var express = require('express'), 
    app = express(),
    fs = require('fs'),
    cons = require('consolidate'),
    mongo = require('mongodb'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;
    
app.use(bodyParser.urlencoded({ extended: false }));// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 

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
    var matching_ids = [];

    //for number of trending keywords
    for (var i = 0; i < filled_parent_array.length; i++){
        //in all child articles
        for(var j = 0; j < numDocs; j++){
            //for length of child keyword array
            for(var k = 0; k < filled_child_obj[j].keywords.length; k++){

                //if keyword matches trending keyword
                if (filled_parent_array[i] == filled_child_obj[j].keywords[k]){
                    console.log("match found!");
                    if (matching_ids.indexOf(filled_child_obj[j].id) == -1){
                        matching_ids.push(filled_child_obj[j].id);
                    }
                }
            }
        }
    }
    console.log(matching_ids)
    callback(filled_parent_array, matching_ids);
}

function getChild(child_obj, parent_array, callback){

    console.log("assembling data");
    getChildArray(child_obj, function(filled_child_obj, numDocs){
        getParentArray(parent_array, function(filled_parent_array){
            compareData(filled_child_obj, numDocs, filled_parent_array, function(filled_parent_array, matching_ids){
                callback(filled_parent_array, matching_ids);
            })
        })
    })
}

function getJSON(callback){
    
    var child_obj = {};
    var parent_array;

    getChild(child_obj, parent_array, function(filled_parent_array, matching_ids){
        
        //do the stuff to make this obj into good json for d3
        //matching_ids > response_json
        console.log("getting json");

        json_obj = {
                'name': filled_parent_array[0],
                'parent': 'null',
                'children': matching_ids
        }

        // console.log(json_obj);

        callback(json_obj)
    })
}

function getDoc(id, callback){
    var myid = new mongo.ObjectID(id);
    console.log(myid);

    db.collection('segue1').findOne({'_id': myid}, function(err, doc){
        if (err) throw err;
        // console.log(doc.title, doc.description);
        callback(doc);
    })

}

app.post('/article', function(req, res){
    getDoc(req.body['docid'], function(doc){
        res.json(doc);
    })
})

app.get('/data', function(req, res){
    
    //run function to get json for d3
    getJSON(function(response_json){
        res.json(response_json);
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
