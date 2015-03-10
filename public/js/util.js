function degToRad(deg)
{
  return deg * 0.01745329222;
}

function radToDeg(rad)
{
  return rad * 57.2957804977;
}

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

function distanceInKilometers(start, end) {
  var lat1 = start.lat;
  var lon1 = start.lng;
  var lat2 = end.lat;
  var lon2 = end.lng;

  var R = 6371; // Radius of the earth in km
  var dLat = degToRad(lat2-lat1);  // deg2rad below
  var dLon = degToRad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function distanceInMiles(start, end) {
  return 0.621371 * distanceInKilometers(start, end);
}