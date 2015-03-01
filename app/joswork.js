var airportsData = require('./airportsData');

var seeMore = 0;


function getAirportList(call) {
	var dests;
	for (var dest in call."Destinations") {
		dests.push(dest);
	}
	return dests;
}



function getChosenTheme(name) {
	for (var theme in getThemes()) {
		if (theme["Name"] == name) {
			return theme["Theme"];
		}
	}
	return null;
}


function getThemes() {
	var apiThemes;
	apiGetThemeObjects(function callback(returnedThemeObject) {
						apiThemes = returnedThemeObject["Themes"];
						});
	var themes;
	for (var theme in apiThemes) {
		themes.push(formatTheme(theme));
	}
	return themes;
}



exports.formatTheme = function(theme) {
	var name = theme["Theme"];
	theme["Name"] = name[0] + name.slice(1,name.length).toLowerCase();
	return theme;
}


function getTopDestination() {
	return seeMore * 5;
}


function seeMore() { 
	if (seeMore < 10) {
		seeMore ++;
		return true;
	} else {
		return false;
	}
}


function error() {
	console.warn('It is a no work');
}



exports.attemptToLocate = function() {
	if ("geolocation" in navigator) {
		var value = null;
		var looping = true;
		navigator.geolocation
		.getCurrentPosition(function getClosestAirport(pos) 
		{
			var userLat = pos.coords.latitude;
			var userLon = pos.coords.longitude;
			var aptLat, aptLon;
			var distance = 8;
			var closestAirport;
			for (var airport in airportsData) {
				if ("lat" in airport && "lon" in airport) {
					aptLat = airport.lat;
					aptLon = airport.lon;
					if (Math.abs(aptLat - userLat) < 5 && Math.abs(aptLon - userLat) < 5) {
						var testDist = getDistance(aptLat, aptLon, userLat, userLon)
						if (testDist < distance) {
							distance = testDist;
							closestAirport = airport;
						}
					}
				}
			}
			value = closestAirport;
			looping = false;
		});
		while(looping){
			sleep(1);
		}
		return value;
	}
}



function sleep(milliseconds) { 
	var start = new Date().getTime(); 
	for (var i = 0; i < 1e7; i++) { 
		if ((new Date().getTime() - start) > milliseconds){ 
			break; 
		} 
	} 
}

function getDestinations() {
	var destinations;
	apiLookupDestination(getClosestAirport(),
						getChosenTheme(),
						getChosenEarliestDate(),
						getChosenMaxFare(),
						getChosenRegion(),
						getTopDestinations(),
						function callback(dests) {
							destinations = dests
						});
	return destinations,
}

function getCityCode() {
	var closestAirport = attemptToLocate();
	if (closestAirport) {
		return closestAirport.iata;
	} else {
		return null;
	}
}


exports.getDistance = function(lat1, lon1, lat2, lon2) {
	var distance = Math.sqrt(Math.pow(lat1-lat2, 2) + Math.pow(lon1-lon2,2));
	console.log(distance);
}

exports.getChosenEarliestDate = function() {

}

exports.getChosenMaxFare = function() {

}

exports.getChosenRegion = function() {

}


exports.showFirstAirport = function() {
	console.log(airportsData[0].iata);
}
