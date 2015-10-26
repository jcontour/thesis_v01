var express = require('express'), 
    app = express(),
    cons = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

var mongoclient = new MongoClient(new Server("localhost", 27017));
var db = mongoclient.db('thesis');

app.get('/', function(req, res){

    // Find  all documents in our collection
    db.collection('segue').find({}).toArray(function(err, docs) {

        if(err) throw err;
        console.dir("found documents");    
        db.close()
        
    });

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
