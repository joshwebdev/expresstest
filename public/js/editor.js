function setStartPoint(lat, lng) {
	levelData.start.lat = lat;
	levelData.start.lng = lng;
}

function setEndPoint(lat, lng) {
	levelData.end.lat = lat;
	levelData.end.lng = lng;
}

function selectStartPoint() {
	$("#message").html("Please select a start point.");
	mapClickedCallback = function(lat, lng) {
		setStartPoint(lat, lng);
		$("#message").html("Start point has been set.");
	};
}

function selectEndPoint() {
	$("#message").html("Please select an end point.");
	mapClickedCallback = function(lat, lng) {
		setEndPoint(lat, lng);
		$("#message").html("End point has been set.");
	};
}

function updateLevelName() {
	levelData.name = $("#levelName").val();
}

var mapClickedCallback = null;

function saveLevel() {
	jQuery.post("/edit", levelData, function(result) {
		if (result.status == "OK")
		{
			if (result.levelId)
				levelData._id = result.levelId;
			$("#message").html("Saved successfully.");
		}
		else
			alert("Error occurred while saving.  Error message: " + result.status);
	}, "json");
}

function playLevel() {
	if (typeof(levelData) == 'undefined' || levelData._id == null || levelData.id == 0)
		alert("Please save the level first.");
	else
		window.open('/play/' + levelData._id)
}
