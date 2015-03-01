import Ember from 'ember';

import APICalls from './api-calls';

export default Ember.Object.extend({
	api: APICalls.create(),
	userCoords: null,

	getThemes: function() {
		var themes = [];

		this.api.getThemeObjects(function(returnedThemeObject) {
			// get themes
			var apiThemes = returnedThemeObject["Themes"];

			// iterate over them
			for(var i = apiThemes.length - 1; i >= 0; i--) {
				var theme = apiThemes[i];

				var name = theme["Theme"];
				theme["Name"] = name[0] + name.slice(1,name.length).toLowerCase();
				themes.push(theme);
			}
		});
		
		return themes;
	},

	getClosestAirports: function() {
		if ("geolocation" in navigator) {
			var values = null;
			var looping = true;

			var _this = this;

			// get current position
			navigator.geolocation.getCurrentPosition(function positionCallback(pos) {
				_this.userCoords = pos.coords;

				// find nearest airports pls
				this.api.getAirportsNearest(_this.userCoords.latitude, _this.userCoords.longitude, 5, function(airports){
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
				_this.sleep(1);
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

	getFormattedDestinations: function(closestAirport, chosenTheme, chosenLengthOfStay, chosenMaxFare, callback) {
		var _this = this;

		// Look up the destination
		this.api.lookupDestination(closestAirport, chosenTheme, chosenLengthOfStay,
								 null, chosenMaxFare, null, null,
		function(inDests) {
			// unformatted destinations
			var unfDests = inDests["FareInfo"];

			// final destinations
			var dests = [];
			var numItineraries = unfDests.length;

			// Figure out destinations and format them
			for (var i = unfDests.length - 1; i >= 0; i--) {
				var unfDest = unfDests[i];

				// handle it
				var fDests = [];

				// extract info
				unfDest["Fare"] = unfDest["LowestFare"];
				var depdate = unfDest["DepartureDateTime"];
				unfDest["DepartureDate"] = depdate.slice(4,6) + "/" + depdate.slice(6,8) + "/" + depdate.slice(0,4);
				var retdate = unfDest["ReturnDateTime"];
				unfDest["ReturnDate"] = retdate.slice(4,6) + "/" + retdate.slice(6,8) + "/" + retdate.slice(0,4);

				fDests.push(unfDest);
			}

			// // Calculate their weights and costs
			// for (var i = fDests.length - 1; i >= 0; i--) {
			// 	var fDest = fDests[i];

			// 	var minCost = 100000;
			// 	var cost, finalIt;

			// 	// get info about this destination pl0x
			// 	_this.api.makeRawSabreAPICall(fDest["Links"][0]["href"], function(destinationInfo) {
				
			// 		// iterate each priced itinerary
			// 		for(var i = destinationInfo.PricedItineraries.length - 1; i >= 0; i--) {
			// 			var itinerary = destinationInfo.PricedItineraries[i];

			// 			// get the total fare
			// 			cost = itinerary.AirItineraryPricingInfo.ItinTotalFare.TotalFare.Amount;
			// 			if(cost < minCost) {
			// 				minCost = cost;
			// 				finalIt = itinerary;
			// 			}
			// 		}

			// 		// turn it into something that avoids murder
			// 		var itinerary = itinerary.AirItinerary.OriginDestinationOptions.OriginDestinationOption;

			// 		finalIt.arriving = _this.processLeg(itinerary[0]);
			// 		finalIt.departing = _this.processLeg(itinerary[1]);

			// 		// set its cost
			// 		finalIt.Cost = minCost;

			// 		}
			// 	});
			// }
			

			// get code
			if(null != null) {
				_this.api.getAirportFromCode(unfDest.DestinationLocation, function(airport) {
					var airport = airport.airports[0];

					it.city = airport.city;
					it.country = airport.country;
					it.name = airport.name;

					if(--numItineraries == 0) {
						callback(dests);
					}
				});
			} else {
				--numItineraries;
			}

			// when done, call the main callback
			if(--numItineraries == 0) {
				callback(fDests);
			}
				
		});

		},


/*
	handleDestination: function(_this, unfDest, callback) {
		var fDests = [];

		// extract info
		unfDest["Code"] = unfDest["DestinationLocation"];
		unfDest["Name"];
		unfDest["Fare"] = unfDest["LowestFare"];
		var depdate = unfDest["DepartureDateTime"];
		unfDest["DepartureDate"] = depdate.slice(0,4) + "/" + depdate.slice(4,6) + "/" + depdate.slice(6,8);
		var retdate = unfDest["ReturnDateTime"];
		unfDest["ReturnDate"] = retdate.slice(0,4) + "/" + retdate.slice(4,6) + "/" + retdate.slice(6,8);

		fDests.push(unfDest);

		// Calculate their weights and costs
		for (var i = fDests.length - 1; i >= 0; i--) {
			var fDest = fDests[i];

			var minCost = 100000;
			var cost, finalIt;

			// get info about this destination pl0x
			_this.api.makeRawSabreAPICall(fDest["Links"][0]["href"], function(destinationInfo) {
				if(destinationInfo) {
					// iterate each priced itinerary
					for(var i = destinationInfo.PricedItineraries.length - 1; i >= 0; i--) {
						var itinerary = destinationInfo.PricedItineraries[i];

						// get the total fare
						cost = itinerary.AirItineraryPricingInfo.ItinTotalFare.TotalFare.Amount;
						if(cost < minCost) {
							minCost = cost;
							finalIt = itinerary;
						}
					}

					// turn it into something that avoids murder
					var itinerary = itinerary.AirItinerary.OriginDestinationOptions.OriginDestinationOption;

					finalIt.arriving = _this.processLeg(itinerary[0]);
					finalIt.departing = _this.processLeg(itinerary[1]);

					// set its cost
					finalIt.Cost = minCost;

					// do the callback m8
					callback(finalIt);
				} else {
					callback(null);
				}
			});
		}
	},
	*/
	pad: function(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	},

	// processes a single leg of the flighte
	processLeg: function(info) {
		// get the date it leaves and length of flight
		var length = info.ElapsedTime * 60;
		var legs = [];

		// go through each leg
		for (var i = info.FlightSegment.length - 1; i >= 0; i--) {
			var leg = info.FlightSegment[i];

			// Extract info from the leg
			var legInfo = {
				departingAirport: leg.DepartureAirport.LocationCode,
				arrivingAirport: leg.ArrivalAirport.LocationCode,

				flightNumber: leg.OperatingAirline.Code + "" + leg.OperatingAirline.FlightNumber,
				stops: leg.StopQuantity
			};

			// Dates are fucking stupid
			var departTz = leg.DepartureTimeZone.GMTOffset;
			var departTime = leg.DepartureDateTime/* + "" + this.pad(departTz, 2) + ":00"*/;
			legInfo.depart = moment(departTime, moment.ISO_8601).toDate();

			var arriveTz = leg.ArrivalTimeZone.GMTOffset;
			var arriveTime = leg.ArrivalDateTime/* + "" + this.pad(arriveTz, 2) + ":00"*/;
			legInfo.arrive = moment(arriveTime , moment.ISO_8601).toDate();

			// Push it
			legs.push(legInfo);
		};

		// shit everything into the great structure of doom
		return {
			length: length,
			legs: legs
		}
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
