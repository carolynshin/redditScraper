var numberScraped;

function getArticles(){
	$.getJSON("/all", function(data){
		
		if (data.length > 1){

			$("#articleContainer").empty();

			for (var i = 0; i < data.length; i++){
				$("#articleContainer").append('<div class="panel panel-default"><div class="panel-body">' + '<a href = "'+ data[i].link +'">'+ data[i].title +'</a>' + '</div><div class="panel-footer"><button type="button" class="btn btn-default btn-lg save-btn" id="' + data[i]._id + '"><span class="glyphicon glyphicon-floppy-save" aria-hidden="true"></span> Save</button></div></div>')
			};

			return numberScraped = data.length;
			console.log(data.length);

		}

	});
};

function getSavedArticles(){


	$("#articleContainer").empty();
	$.getJSON("/saved", function(data){
		console.log(data);
		for (var i = 0; i < data.length; i++){
			$("#articleContainer").append('<div class="panel panel-default"><div class="panel-body">' + '<a href = "'+ data[i].link +'">'+ data[i].title +'</a>' + '</div><div class="panel-footer"><button type="button" class="btn btn-default btn-lg addNote" id="' + data[i]._id + '">Add Note<button type="button" class="btn btn-default btn-lg deleteSaved" id="' + data[i]._id + '">Delete</button></div></div>')
		};
	});

};

getArticles();

$("#home").on("click", function(){
	getArticles();
})

$("#delete").on("click", function(){
	$.ajax({
		type: "GET",
		url: "/delete"
	})
	$("#articleContainer").empty();
})

$("#scrape").on("click", function(){
	$.ajax({
		type: "GET",
		url: "/scrape"
	}).done(function(){
		getArticles()
	}).done(function(){
			$("#numberScraped").html("Scraped " + numberScraped + " articles!");
			$("#myModal").modal("show");
		});
})

$(document).on("click", ".addNote", function(event){
	event.preventDefault();
	var thisId = $(this).attr("id");
	$("#notesid").text(thisId);
	$.ajax({
		type: "GET",
		url: "/getnotes/" + thisId
	}).done(function(data){
		var noteText;
		if (data[0].notes) {
			noteText = data[0].notes;
		} else {
			noteText = "";
		}
		$("#savedNote").html(noteText);
		$("#notesModal").modal("show");

	})

})


$(document).on("click", "#makenote", function(event){
	event.preventDefault();
	console.log($("#notesid")[0].innerHTML);
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/submitnote",
		data: {
			note: $("#notetext").val(),
			notesid: $("#notesid")[0].innerHTML
		}
	}).done(function(){
		$("#notesModal").modal("hide");
	})
})

$(document).on("click", ".save-btn", function(event){
	event.preventDefault();
	var thisId = $(this).attr("id");
	console.log("saving " + thisId);
	$.ajax({
		type: "POST",
		url: "/savepost",
		data: {
			id : thisId
		}
	});
	getArticles();
});

$("#savedarticles").on("click", function(){

	getSavedArticles();

})

$(document).on("click", ".deleteSaved", function(event){
	event.preventDefault();
	var thisId = $(this).attr("id");
	console.log(thisId);
	$.ajax({
		type: "POST",
		url: "/deletepost",
		data: {
			id: thisId
		}
	}).done(function(){
		getSavedArticles();
	});
});