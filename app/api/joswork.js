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

	findAirport: function(_this, definition, callback) {
		// map to city
		_this.api.getAirportFromCode(definition.DestinationLocation, function(a) {
			var airport = a.airports[0];

			definition.city = airport.city;
			definition.country = airport.country;
			definition.name = airport.name;

			//console.log(definition);

			callback();
		});		
	},

	findFlights: function(_this, definition, callback) {
		_this.api.makeRawSabreAPICall(definition["Links"][0]["href"], null, function(destinationInfo) {
			if(destinationInfo != null) {
				var itineraries = [];

		 		// iterate each priced itinerary
		 		for(var i = destinationInfo.PricedItineraries.length - 1; i >= 0; i--) {
		 			var itinerary = destinationInfo.PricedItineraries[i];

		 			var obama = itinerary.AirItinerary.OriginDestinationOptions.OriginDestinationOption;
		 			itinerary.cost = itinerary.AirItineraryPricingInfo.ItinTotalFare.TotalFare.Amount;

		 			//console.log(itinerary.AirItineraryPricingInfo.ItinTotalFare.TotalFare.Amount);

		 			itinerary.arriving = _this.processLeg(obama[0]);
		 			itinerary.departing = _this.processLeg(obama[1]);

		 			itineraries.push(itinerary);
		 		}

		 		definition.flights = itineraries.reverse();

		 		//console.log(itineraries);
			}

			callback();

	 		// idk even
	 	});
	},

	getFormattedDestinations: function(closestAirport, chosenTheme, chosenLengthOfStay, chosenMaxFare, callback) {
		var _this = this;

		// Look up the destination
		this.api.lookupDestination(closestAirport, chosenTheme, chosenLengthOfStay,
								 moment().add(2, 'd').format('YYYY-MM-DD'), chosenMaxFare, null, null,
		function(inDests) {
			// unformatted destinations
			var unfDests = inDests["FareInfo"];
			
			// final destinations
			var fDests = [];
			var numItineraries = unfDests.length * 3;

			// Figure out destinations and format them
			for (var i = unfDests.length - 1; i >= 0; i--) {
				var unfDest = unfDests[i];

				// extract info
				unfDest["Fare"] = unfDest["LowestFare"];
				var depdate = unfDest["DepartureDateTime"];
				unfDest["DepartureDate"] = depdate.slice(4,6) + "/" + depdate.slice(6,8) + "/" + depdate.slice(0,4);
				var retdate = unfDest["ReturnDateTime"];
				unfDest["ReturnDate"] = retdate.slice(4,6) + "/" + retdate.slice(6,8) + "/" + retdate.slice(0,4);

				// fetch airport
				_this.findAirport(_this, unfDest, function() {
					if(--numItineraries == 0) {
						callback(fDests);
					}
				});

				// get some more infos
				_this.findFlights(_this, unfDest, function() {
					if(--numItineraries == 0) {
						callback(fDests);
					}
				});			 	

				fDests.push(unfDest);

				// when done, call the main callback
				if(--numItineraries == 0) {
					callback(fDests);
				}
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
