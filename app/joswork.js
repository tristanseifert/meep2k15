import Ember from 'ember';

/*
exports.getAirportList = function(call) {
	var dests;
	for (var dest in call.Destinations) {
		dests.push(dest);
	}
	return dests;
}
*/

/*
exports.getChosenTheme = function(name) {
	for (var theme in getThemes()) {
		if (theme["Name"] == name) {
			return theme["Theme"];
		}
	}
	return null;
}
*/

exports.getThemes = function() {
	var themes;
	apiGetThemeObjects(function callback(returnedThemeObject) {
							var apiThemes;
							apiThemes = returnedThemeObject["Themes"];
							for (var theme in apiThemes) {
								var name = theme["Theme"];
								theme["Name"] = name[0] + name.slice(1,name.length).toLowerCase();
								themes.push(theme);
							}
						});
	
	return themes;
}



exports.formatTheme = function(theme) {
	
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

exports.getClosestAirports = function() {
	if ("geolocation" in navigator) {
		var values = null;
		var looping = true;
		navigator.geolocation
		.getCurrentPosition(function positionCallback(pos) 
		{
			userCoords = pos.coords;
			apiGetAirportsNearest(userCoords.latitude, userCoords.longitude, 5, function callback(airports){
				values = airports["airports"];
				for (var value in values) {
					apiGetAirportFromCode(value["code"], function callback(airport) {
						value["Name"] = airport["airports"][0]["name"];
					});
					value["Display"] = value["city"] + " (" + value["code"] + ")";
				}
			})
			looping = false;
		});
		while(looping){
			sleep(1);
		}
		return values;
	}
}


/*
exports.formatAirports = function(airports) {
	for (var airport in airports) {
		airport["Display"] = airport["city"] + " (" + airport["code"] + ")";
	}
}
*/

exports.sleep = function(milliseconds) { 
	var start = new Date().getTime(); 
	for (var i = 0; i < 1e7; i++) { 
		if ((new Date().getTime() - start) > milliseconds){ 
			break; 
		} 
	} 
}

/*
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
<<<<<<< HEAD
}
*/
export.getFormattedDestinations = function(closestAirport, chosenTheme, chosenLengthOfStay chosenMaxFare) {
	var dests;
	apiLookupDestination(closestAirport(),
						chosenTheme(),
						chosenLengthOfStay(),
						null,
						chosenMaxFare(),
						null,
						null,
						function callback(dests) {
							var unfDests = dests["FareInfo"];
							for (var unfDest in unfDests) {
								dests = new Array();
								dests.push(function(){
									this["Code"] = unfDest["DestinationLocation"];
									this["Name"];
									this["Fare"] = unfDest["LowestFare"];
									var depdate = unfDest["DepartureDateTime"];
									this["DepartureDate"] = depdate.slice(0,4) + "/" + depdate.slice(4,6) + "/" + depdate.slice(6,8);
									var retdate = unfDest["ReturnDateTime"];
									this["ReturnDate"] = retdate.slice(0,4) + "/" + retdate.slice(4,6) + "/" + retdate.slice(6,8);
									//DATA HERE
								})
							}
						});
	return dests;
=======
>>>>>>> d1d1f16be4b23bf2c2395fdaf94f5144a0f32096
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
