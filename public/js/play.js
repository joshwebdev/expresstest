var Car = function()
{
	this.rotation = 272;
	this.lat = levelData.start.lat;
	this.lng = levelData.start.lng;
	this.velocity = 0.0;
}

Car.prototype.tick = function()
{
	if (keys.left)
		this.rotation -= 5;
	if (keys.right)
		this.rotation += 5;

	$("#carImage").css('transform', 'rotate(' + this.rotation + 'deg)');
	$("#carImage").css('-ms-transform', 'rotate(' + this.rotation + 'deg)');
	$("#carImage").css('-webkit-transform', 'rotate(' + this.rotation + 'deg)');
	$("#carImage").css('left', (window.innerWidth / 2 - 14) + 'px');
	$("#carImage").css('top', (window.innerHeight / 2 - 28) + 'px');

	var targetLat = levelData.end.lat;
	var targetLng = levelData.end.lng;

	var arrowRotation = radToDeg(Math.atan2(targetLng - this.lng, targetLat - this.lat));
	$("#arrow").css('transform', 'rotate(' + arrowRotation + 'deg)');
	$("#arrow").css('-ms-transform', 'rotate(' + arrowRotation + 'deg)');
	$("#arrow").css('-webkit-transform', 'rotate(' + arrowRotation + 'deg)');
	$("#arrow").css('left', (window.innerWidth * 0.8) + 'px');
	$("#arrow").css('top', (window.innerHeight * 0.1) + 'px');

	var distanceLeft = distanceInMiles({lat: car.lat, lng: car.lng}, levelData.end);
	$("#distanceLeft").html(distanceLeft.toFixed(2) + " mi");
	$("#distanceLeft").css('left', (parseInt($("#arrow").css('left')) - 5) + 'px');
	$("#distanceLeft").css('top', (parseInt($("#arrow").css('top')) + 80) + 'px');

	if (distance(targetLat, targetLng, this.lat, this.lng) < 0.001)
	{
		$("#arrow").css('visibility', 'hidden');
		$("#distanceLeft").css('visibility', 'hidden');
		$("#winScreen").css('visibility', 'visible');
	}
	else
	{
		$("#arrow").css('visibility', 'visible');
		$("#distanceLeft").css('visibility', 'visible');
		$("#winScreen").css('visibility', 'hidden');
	}


	if (googleMap != null)
	{
		if (keys.up)
		{
			this.velocity += 0.000001;
			if (this.velocity > 0.00003)
				this.velocity = 0.00003;
		}
		else
		{
			if (this.velocity > 0.0)
			{
				this.velocity -= 0.000002;
				if (this.velocity < 0.0)
					this.velocity = 0.0;
			}
		}

		if (keys.down)
		{
			this.velocity -= 0.000002;
			if (this.velocity < -0.00001)
				this.velocity = -0.00001;
		}
		else
		{
			if (this.velocity < 0.0)
			{
				this.velocity += 0.000002;
				if (this.velocity > 0.0)
					this.velocity = 0.0;
			}
		}


		this.lat -= Math.cos(degToRad(this.rotation)) * this.velocity;
		this.lng -= Math.sin(degToRad(this.rotation)) * this.velocity;
		googleMap.setCenter(new google.maps.LatLng( this.lat, this.lng ) );
	}
}

var Keys = function()
{
	this.left = false;
	this.right = false;
	this.up = false;
	this.down = false;
}

var car = new Car();
var keys = new Keys();

function tick()
{
	car.tick();
}

$(document).keydown(function(event)
{
	if (event.which == 65)
		keys.left = true;
	if (event.which == 68)
		keys.right = true;
	if (event.which == 87)
		keys.up = true;
	if (event.which == 83)
		keys.down = true;
});

$(document).keyup(function(event)
{
	if (event.which == 65)
		keys.left = false;
	if (event.which == 68)
		keys.right = false;
	if (event.which == 87)
		keys.up = false;
	if (event.which == 83)
		keys.down = false;
});

setInterval(tick, 32);


function distance( x1, y1, x2, y2 )
{
  var xs = 0;
  var ys = 0;
 
  xs = x2 - x1;
  xs = xs * xs;
 
  ys = y2 - y1;
  ys = ys * ys;
 
  return Math.sqrt( xs + ys );
}


var Level = function()
{
	this.startLat = 0.0;
	this.startLng = 0.0;

	this.setStartingPoint = function(lat, lng) {
		this.startLat = lat;
		this.startLng = lng;

		console.log("lat: " + lat);
	}
}

var currentLevel = new Level;


var mapClicked = currentLevel.setStartingPoint;