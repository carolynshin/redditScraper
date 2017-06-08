//Dependencies
var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var databaseURL = "scraper";
var collections = ["reddit"];
var db = mongojs(databaseURL, collections);
db.on("error", function(error){
	console.log("Database Error:", error);
});

//Telling our console.log what server.js is doing
console.log("\n***********************************\n" +
	"Grabbing every thread name and link" +
	"from reddit's world news subreddit" +
	"\n***********************************\n");

app.get("/all", function(req, res){
	db.reddit.find({"saved": false}, function(error, found){
		if (error) {
			console.log(error);
		}
		else {
			res.json(found);

		}
	})
})

app.get("/scrape", function(req, res){

	request("https://www.reddit.com/r/worldnews/", function(error, response, html){
		console.log(html);
		var $ = cheerio.load(html);
		var result = [];
		$("p.title").each(function(i, element){
			var title = $(this).text();
			var link = $(element).children().attr("href");

			if (title && link){
				db.reddit.save({
					title: title,
					link: link,
					saved: false},
					function(error, saved){
						if(error){
							console.log(error);
						}
						else {
							console.log("saved")
						}
					}
				);
			};

		});
		res.send("Scrape complete");
	})
	
})

app.get("/delete", function(req, res){
	db.reddit.remove();
})

app.post("/savepost", function(req, res){
	console.log(req.body);
	db.reddit.update({
		"_id": mongojs.ObjectId(req.body.id)
	}, {
		$set: {
			"saved" : true
		}
	}, 
	function(error, edited){
		if (error){
			console.log(error);
		} else {
			console.log(edited);
			res.send(edited);
		}
	})
})

app.post("/deletepost", function(req, res){
	console.log(req.body);
	db.reddit.update({
		"_id": mongojs.ObjectId(req.body.id)
	}, {
		$set: {
			"saved": false
		}
	},
	function(error, edited){
		if (error){
			console.log(error);
		} else {
			console.log(edited);
			res.send(edited);
		}
	})
})

app.post("/submitnote", function(req, res){
	console.log(req.body);
	db.reddit.update({
		"_id": mongojs.ObjectId(req.body.notesid)
	}, {
		$set:{
			"notes": req.body.note
		}
	}, function(error, edited){
		if (error){
			console.log(error);
		} else {
			console.log(edited);
			res.send(edited);
		}
	})
})

app.get("/getnotes/:thisId", function(req, res){
	db.reddit.find({"_id": mongojs.ObjectId(req.params.thisId)}, function(error, found){

		if (error){
			console.log(error);
		}
		else {
			res.json(found);
		}
	})
})


app.get("/saved", function(req, res){
	db.reddit.find({"saved": true}, function(error, found){
		if (error) {
			console.log(error);
		}
		else {
			res.json(found);

		}
	})
})

app.get("/home", function(req, res){
	db.reddit.find({"saved": false}, function(error, found){
		if (error) {
			console.log(error);
		}
		else {
			res.json(found);

		}
	})
})

app.listen(3000, function(){
	console.log("App running on port 3000")
})