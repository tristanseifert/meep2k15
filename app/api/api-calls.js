import Ember from 'ember';

var SABRE_API_BASE_URL = "https://api.test.sabre.com/";
var SABRE_API_VERION = "v1/";

var CONFIG_API_AUTH = "Bearer Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTD!ICESMSLB\/CRT.LB!-0123456789012345678!123456!0!ABCDEFGHIJKLM!E2E-1";

var SABRE_API_DESTINATION_FINDER_BASE = "shop/flights/fares/";
//var SABRE_API_TRAVEL_THEME_LOOKUP_BASE = "lists/supported/shop/themes/";
var SABRE_API_TRAVEL_AIRPORT_LOOKUP_BASE = "lists/supported/shop/themes/";
var SABRE_API_AIRPORT_AT_CITY_LOOKUP_BASE = "lists/supported/cities/";

export default Ember.Object.extend({
	makeAPICall: function(base, args, callback){
		var arrs = "";

		if(args.length > 0) {
			var resp = [];
			Ember.$.map(args, function(obj/*, index*/){
				if(obj[1] != null){
					resp.push(obj[0] + "=" + obj[1]);
				}
			});
			arrs = resp.join("&");
		}

		Ember.$.ajax(SABRE_API_BASE_URL + SABRE_API_VERION + base, {
			headers: { 'Authorization': CONFIG_API_AUTH },
			data: arrs,
			error: function(/* jqXHR, textStatus, errorThrown */){ callback(null); },
			success: function(data/*, dataType, dataFilter*/){ callback(data); }
		});
	},

	apiGetThemeObjects: function(callback) {
		this.makeAPICall(SABRE_API_TRAVEL_AIRPORT_LOOKUP_BASE, [], callback);
	},

	apiAirportLookupByTheme: function(theme, callback) {
		this.makeAPICall(SABRE_API_TRAVEL_AIRPORT_LOOKUP_BASE + theme, [], callback);
	},

	apiLookupDestination: function(origin, theme, lengthOfStay,
								   earliestDepartureDate, maxFare,
								   region, topDestinations, callback){
		var args = [
			["origin", origin],
			["theme", theme],
			["lengthofstay", lengthOfStay],
			["earliestdeparturedate", earliestDepartureDate],
			["maxFare", maxFare],
			["region", region],
			["topdestinations", topDestinations]
		];

		this.makeAPICall(SABRE_API_DESTINATION_FINDER_BASE, args, callback);
	},

	apiGetAirportsInCity: function(cityCode, callback){
		this.makeAPICall(SABRE_API_AIRPORT_AT_CITY_LOOKUP_BASE + cityCode + "/airports/", [], callback);
	}
});