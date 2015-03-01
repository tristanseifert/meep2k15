import Ember from 'ember';

import APICalls from './api-calls';

export default Ember.Object.extend({
	api: APICalls.create(),

	getThemes: function() {
		var themes = [];

		this.api.getThemeObjects(function(returnedThemeObject) {
			// get themes
			var apiThemes = returnedThemeObject["Themes"];

			// iterate over them
			for(var i = apiThemes.length - 1; i >= 0; i--) {
				var theme = apiThemes[i];

				console.log(theme);

				var name = theme["Theme"];
				theme["Name"] = name[0] + name.slice(1,name.length).toLowerCase();
				themes.push(theme);
			};
		});
		
		return themes;
	},

	getClosestAirports: function() {
		if ("geolocation" in navigator) {
			var values = null;
			var looping = true;
			navigator.geolocation
			.getCurrentPosition(function positionCallback(pos) {
				userCoords = pos.coords;
				this.api.getAirportsNearest(userCoords.latitude, userCoords.longitude, 5, function(airports){
					values = airports["airports"];
					for (var value in values) {
						this.api.getAirportFromCode(value["code"], function(airport) {
							value["Name"] = airport["airports"][0]["name"];
						});
						value["Display"] = value["city"] + " (" + value["code"] + ")";
					}
				});
				looping = false;
			});
			while(looping){
				sleep(1);
			}
			return values;
		} else {
			return null;
		}
	},

	sleep: function(milliseconds) { 
		var start = new Date().getTime(); 
		for (var i = 0; i < 1e7; i++) { 
			if ((new Date().getTime() - start) > milliseconds) { 
				break; 
			} 
		} 
	},

	getFormattedDestinations: function(closestAirport, chosenTheme, chosenLengthOfStay, chosenMaxFare) {
		var dests;
		this.api.lookupDestination(closestAirport(), chosenTheme(), chosenLengthOfStay(),
								 null, chosenMaxFare(), null, null,
		function callback(dests) {
			var unfDests = dests["FareInfo"];
			var fDests
			for (var unfDest in unfDests) {
				fDests = new Array();
				fDests.push(function(){
					this["Code"] = unfDest["DestinationLocation"];
					this["Name"];
					this["Fare"] = unfDest["LowestFare"];
					var depdate = unfDest["DepartureDateTime"];
					this["DepartureDate"] = depdate.slice(0,4) + "/" + depdate.slice(4,6) + "/" + depdate.slice(6,8);
					var retdate = unfDest["ReturnDateTime"];
					this["ReturnDate"] = retdate.slice(0,4) + "/" + retdate.slice(4,6) + "/" + retdate.slice(6,8);
					//DATA HERE
				});
				for (var fDest in fDests) {
					var minCost=100000;
					var cost, finalIt;
					makeRawSabreAPICall(fDest["FareInfo"]["Links"]["href"], function(destinationInfo) {
						for (var itinerary in destinationInfo.PricedItineraries) {
							cost = itinerary.FareInfos.ItinTotalFare.TotalFare.Amount;
							if(cost < minCost) {
								minCost = cost;
								finalIt = itinerary;
							}
						}
						finalIt.Cost = minCost;
					});
					dests.push(finalIt)
				}
			}
		});
		return dests;
	},

	getCityCode: function() {
		var closestAirport = attemptToLocate();
		if (closestAirport) {
			return closestAirport.iata;
		} else {
			return null;
		}
	},

	getRealDestinations: function() {
		
	}
});
