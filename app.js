// includes
var express = require('express');
var handlebars = require('express-hbs');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var ObjectId=require('mongodb').ObjectID;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({strict: false, extended: true})); // support client-to-server JSON posts

// use Handlebars for templating on all html files
app.engine('hbs', handlebars.express4({
	partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// database collections, initialized upon database collection
var Collections = {};
Collections.Levels = {}; // 'levels'

// routes...

// homepage
app.get('/', function(req, res) {
	res.render('index');
});

// get a level's data
app.get('/level/:level_id', function(req, res) {
	Collections.Levels.findOne( {_id: ObjectId(req.params.level_id) }, function(err, item) {
		if (err)
			console.log("Error during query: " + err);
		res.send(item);
	});
});

// get all levels' data
app.get('/level', function(req, res) {
	Collections.Levels.find({}).toArray(function(err, items) {
		if (err)
			console.log("Error retrieving levels: " + err);
		res.send(items);
	});
});

// create new level
app.get('/new', function(req, res) {
	var basicLevel = {
		name: "untitled",
		start: {
			lat: 43.075204,
			lng: -89.447440
		},
		end: {
			lat: 43.075234,
			lng: -89.447460	
		}
	};

	res.render('edit', { levelJSON: JSON.stringify(basicLevel) });
});

// edit existing level
app.get('/edit/:level_id', function(req, res) {
	Collections.Levels.findOne( {_id: ObjectId(req.params.level_id)}, function(err, item) {
		if (err)
			console.log("Error during query: " + err);
		var levelData = item;
		res.render('edit', { levelJSON: JSON.stringify(levelData) });
	});
});

// REST: create or update a level
app.post('/edit', function(req, res) {
	var levelData = req.body;
	var responseData = { status: "OK", levelId : "0"};

	if (typeof levelData.start == 'undefined' || typeof levelData.end == 'undefined') {
		responseData.status = "Missing parameters.";
		res.send(responseData);
		return;
	}

	// make sure all floats are still floats and not strings...
	levelData.start.lat = parseFloat(levelData.start.lat);
	levelData.start.lng = parseFloat(levelData.start.lng);
	levelData.end.lat = parseFloat(levelData.end.lat);
	levelData.end.lng = parseFloat(levelData.end.lng);

	// if a new level
	if (!levelData._id) {
		Collections.Levels.insert(levelData, function(err, result) {
			if (err) {
				console.log("Error inserting new level: " + err);
				responseData.levelId = null;
				responseData.status = "Error inserting data";
			}
			else {
				responseData.levelId = result[0]._id;
				responseData.status = "OK";
				res.send(responseData);
			}
		});
	}
	else { // updating existing level
		Collections.Levels.update( {_id: ObjectId(levelData._id) }, { $set: {
				name: levelData.name,
				start: {lat: levelData.start.lat, lng: levelData.start.lng},
				end: {lat: levelData.end.lat, lng: levelData.end.lng},
			} }, function (err) {
			if (err) {
				console.log("Error updating");
				responseData.levelId = levelData._id;
				responseData.status = "Error updating data";
			}
			else {
				responseData.levelId = levelData._id;
				responseData.status = "OK";
				res.send(responseData);
			}
		});
	}
});

// play a level
app.get('/play/:level_id', function(req, res) {
	Collections.Levels.findOne( {_id: ObjectId(req.params.level_id) }, function(err, levelData) {
		if (err)
			console.log("Error during query: " + err);
		res.render('play', {
			levelJSON: JSON.stringify(levelData)
		});
	});
});

// list levels
app.get('/play', function(req, res) {
	Collections.Levels.find({}).toArray(function(err, items) {
		if (err)
			console.log("Error retrieving levels: " + err);
		res.render('play_list', {levels: items});
	});
});

// static files
app.use(express.static(path.join(__dirname, 'public')));

// connect to database and start listening for HTTP requests
MongoClient.connect('mongodb://localhost:27017/cars', function(err, db) {
	if (err) {
		console.log("Error connecting to database: " + err);
		return;
	}
	app.listen(3000);
	Collections.Levels = db.collection('levels');
	console.log("Server running on port 3000");
});
