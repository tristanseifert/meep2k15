import airportsData from './data/airports.js';

var seeMore = 0;
/*
exports.getAirportList = function(call) {
	var dests;
	for (var dest in call."Destinations") {
		dests.push(dest);
	}
	return dests;
}
*/


exports.getChosenTheme = function(name) {
	for (var theme in getThemes()) {
		if (theme["Name"] == name) {
			return theme["Theme"];
		}
	}
	return null;
}


exports.getThemes = function() {
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


/*

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

*/

exports.attemptToLocate = function() {
	if ("geolocation" in navigator) {
		var value = null;
		var looping = true;
		navigator.geolocation
		.getCurrentPosition(function getClosestAirport(pos) 
		{
			userCoords = pos.coords;
			apiGetAirportsNearest(userCoords.latitude, userCoords.longitude, 5, function callback(airports){
				value = airports["airports"];
			})
			looping = false;
		});
		while(looping){
			sleep(1);
		}
		return value;
	}
}

exports.formatAirports = function(airports) {
	for (var airport in airports) {
		airport["Display"] = airport["city"] + " (" + airport["code"] + ")";
	}
}


exports.sleep = function(milliseconds) { 
	var start = new Date().getTime(); 
	for (var i = 0; i < 1e7; i++) { 
		if ((new Date().getTime() - start) > milliseconds){ 
			break; 
		} 
	} 
}

exports.getDestinations = function(closestAirport, chosenTheme, chosenLengthOfStay, chosenMaxFare) {
	var destinations;
	apiLookupDestination(closestAirport(),
						chosenTheme(),
						chosenLengthOfStay(),
						null,
						chosenMaxFare(),
						null,
						null,
						function callback(dests) {
							destinations = dests["FareInfo"];
						});
	return destinations;
}

export.getFormattedDestinations = function(closestAirport, chosenTheme, chosenLengthOfStay chosenMaxFare) {
	var unfDests = getDestinations(closestAirport, chosenTheme, chosenLengthOfStay chosenMaxFare);
	var fDests = new Array();
	for (var unfDest in unfDests) {
		fDests.push(function(){
			this["Code"] = unfDest["DestinationLocation"];
			this["Name"];
			this["Fare"] = unfDest["LowestFare"];
			var depdate = unfDest["DepartureDateTime"];
			this["DepartureDate"] = depdate.slice(0,4) + "/" + depdate.slice(4,6) + "/" + depdate.slice(6,8);
			var retdate = unfDest["ReturnDateTime"];
			this["ReturnDate"] = retdate.slice(0,4) + "/" + retdate.slice(4,6) + "/" + retdate.slice(6,8);
		})
	}
}


exports.getCityCode = function() {
	var closestAirport = attemptToLocate();
	if (closestAirport) {
		return closestAirport.iata;
	} else {
		return null;
	}
}

/*
exports.getDistance = function(lat1, lon1, lat2, lon2) {
	var distance = Math.sqrt(Math.pow(lat1-lat2, 2) + Math.pow(lon1-lon2,2));
	console.log(distance);
}
*/


/*
exports.showFirstAirport = function() {
	console.log(airportsData[0].iata);
}
*/
