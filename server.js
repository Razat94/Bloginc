//initialize
const express = require('express')
const app = express()
var MongoClient = require('mongodb').MongoClient

// You just need to require the ObjectId function from your mongo.
// var ObjectId = require('mongodb').ObjectID;
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    assert = require('assert');

//set view engine as ejs
app.set('view engine', 'ejs')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// setting public as a default folder for static files
app.use(express.static('public'))

// Create a server at Port 3000 and connect to browser
app.listen(process.env.PORT || 3000, () => {
	console.log('listening on port 3000')
})

// Set Paths
app.get('/', (req, res) => {
	res.redirect("home");
})

app.get('/Add', (req,res) => {
	res.sendFile(__dirname + '/views/Add-Blog.html');
})

app.get('/Update', (req,res) => {
	res.render('Update-Blog.ejs');
})

var url = "mongodb://localhost:27017/";


MongoClient.connect(url, (err, database) => {
	if (err) return console.log(err)
	var dbo = database.db("blog-posts");
	
	// Create
	app.post('/blog-posts', (req, res) => {
		// console.log(req.body);
		dbo.collection("posts").find({}).toArray(function(err, result) {
			// Only add a post if the number of records in the database is less than 5.
			if ( result.length < 5 ) { 
				dbo.collection('posts').insertOne(req.body, (err, response) => {
					if (err) return console.log(err)
					console.log('saved to database')
				})
			}
			res.redirect('/')
		});
	})
	
	// Read
	app.get('/home', (req,res) => {
		dbo.collection('posts').find().toArray((err, result) => {
			if (err) return console.log(err)
			// renders index.ejs
			res.render('homepage.ejs', {posts: result})
		})
	})
	
	/*
	// If you ever want to test posting data...
	app.post('/Update', (req, res) => {
		console.log(req.body);
	})
	*/
	
	// Update
	app.put('/Update', (req, res) => {
		var new_value = { $set:  req.body  };
		/*
		var query_obj = {
			['_id']: ObjectId(req.body.id)
		}
		console.log(query_obj);
		*/
		// var query = {_id:ObjectId('569ed8269353e9f4c51617aa')};
		// var blah = new ObjectId('dlskfj');
		
		// this one works
		var blah = new ObjectID(req.body.id);

		// these don't
		var query_obj = {
			['_id']: blah
		}
		
		
		var obj = {
			['_id']: req.body.id
		}
		
		dbo.collection("posts").find(blah).toArray(function(err, findResult) {
			if (err) throw err;
			// REMEMBER: findResult is an ARRAY of objects, even if it only has 1 object in it. The updateOne method needs to receive an object as a param, not an array.
			// console.log(findResult[0]);
			
			dbo.collection('posts').updateOne(findResult[0], new_value, (err, updateResult) => {
				if (err) throw err;
				app.get('/', (request, result) => {
					res.redirect("/home");
				})
			})
		});
	})

	/*
	Alternative(?) NOT WORKING
	app.post('/Update', (req, res) => {
		console.log("Is this even being called?");
		console.log(req.body);
		var new_value = { $set: { title: req.body.title, name: req.body.name, description: req.body.description } };
		console.log(new_value);
		dbo.collection('posts').updateOne({id: req.body.id}, new_value, (err, result) => {
			if (err) throw err;
			// res.send(result)
			console.log("Hello");
			res.redirect('/');
		})
	})
	*/
	
	// Delete
	app.delete('/home', (req, res) => {
		console.log( "You click on index " + req.body.index );
		dbo.collection("posts").find({}).toArray(function(err, result) {
			if (err) throw err;
			// console.log( result[req.body.index] );
			dbo.collection("posts").deleteOne( result[req.body.index], function(err, obj) {
				if (err) throw err;
				console.log("1 document deleted");
				app.get('/home', (request, result) => {
					res.redirect("/");
				})
			}); // End of delete query
		}) // End of find query.
	}) // End of delete method
})
