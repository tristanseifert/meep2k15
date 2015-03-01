/**
 * API Calls for Find Me An Adventure
 *
 * HackDFW 2015
 *
 */
import Ember from 'ember';

var SABRE_API_KEY = "Bearer Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTD!ICESMSLB\/CRT.LB!-0123456789012345678!123456!0!ABCDEFGHIJKLM!E2E-1";

var SABRE_API_BASE_URL = "https://api.test.sabre.com/";
var SABRE_API_VERION = "v1/";

var SABRE_API_DESTINATION_FINDER = "shop/flights/fares/";
var SABRE_API_INSTAFLIGHT = "shop/flights/";
var SABRE_API_TRAVEL_THEME_LOOKUP = "lists/supported/shop/themes/";
var SABRE_API_AIRPORT_AT_CITY_LOOKUP = "lists/supported/cities/";

var SITA_API_KEY = "e690a6ebac2897d2d20a40f3c1eacb40";

var SITA_API_AIRPORT_URL = "https://airport.api.aero/airport/";
var SITA_API_AIRPORT_NEAREST = "nearest/";

var JSONP_PROXY_URL="https://jsonp.nodejitsu.com/";

export default Ember.Object.extend({
	makeSabreAPICall: function(base, args, callback){
	    var arrs = "";
	    if(args.length > 0){
	        var resp = [];
	        Ember.$.map(args, function(obj/*, index*/){
	            if(obj[1] != null){
	                resp.push(obj[0] + "=" + obj[1]);
	            }
	        });
	        arrs = resp.join("&");
	    }
	    Ember.$.ajax(SABRE_API_BASE_URL + SABRE_API_VERION + base, {
	        headers: { 'Authorization': SABRE_API_KEY },
	        data: arrs,
	        error: function(/*jqXHR, textStatus, errorThrown*/){ callback(null); },
	        success: function(data/*, dataType, dataFilter*/){ callback(data); }
	    });
	},

	// makeRawSabreAPICall: function(url, args, callback){
	// 	Ember.$.ajax(url, {
	//         headers: { 'Authorization': SABRE_API_KEY },
	//         data = args;
	//         error: function(/*jqXHR, textStatus, errorThrown*/){ callback(null); },
	//         success: function(data/*, dataType, dataFilter*/){ callback(data); }
	//     });
	// },

	makeSitaAPICall: function(base, args, callback){
	    var arrs = "";

	    args.push(["user_key", SITA_API_KEY]);
	    if(args.length > 0){
	        var resp = [];
	        Ember.$.map(args, function(obj/*, index*/) {
	            if(obj[1] != null){
	                resp.push(obj[0] + "=" + obj[1]);
	            }
	        });
	        arrs = resp.join("%26");
	    }
	    Ember.$.ajax(JSONP_PROXY_URL, {
	        data: "url=" + SITA_API_AIRPORT_URL + base + "?" + arrs,
	        error: function(/*jqXHR, textStatus, errorThrown*/) { callback(null); },
	        success: function(data/*, dataType, dataFilter*/) { callback(data); }
	    });
	},

	getThemeObjects: function(callback){
	    this.makeSabreAPICall(SABRE_API_TRAVEL_THEME_LOOKUP, [], callback);
	},

	lookupAirportByTheme: function(theme, callback){
	    this.makeSabreAPICall(SABRE_API_TRAVEL_THEME_LOOKUP + theme, [], callback);
	},

	lookupDestination: function(origin, theme, lengthOfStay,
	                              earliestDepartureDate, maxFare,
	                              region, topDestinations, callback){
	    var args = [
	        ["origin",origin],
	        ["theme",theme],
	        ["lengthofstay",lengthOfStay],
	        ["earliestdeparturedate",earliestDepartureDate],
	        ["latestdeparturedate", earliestDepartureDate],
	        ["maxFare",maxFare],
	        ["region",region],
	        ["topdestinations",topDestinations]
	    ];
	    this.makeSabreAPICall(SABRE_API_DESTINATION_FINDER, args, callback);
	},

	getAirportsInCity: function(cityCode, callback){
	    this.makeSabreAPICall(SABRE_API_AIRPORT_AT_CITY_LOOKUP + cityCode + "/airports/", [], callback);
	},

	getAirportsNearest: function(lat, lng, maxAirports, callback){
	    this.makeSitaAPICall(SITA_API_AIRPORT_NEAREST + lat + "/" + lng, [["maxAirports", maxAirports]], callback);
	},

	getInstaFlight: function(url, maxFare, limit, sortBy, callback){
		var urls = url.split("?");
		var args = urls[1].split("&");
		args.push(["maxFare", maxFare]);
		args.push(["limit", limit]);
		args.push(["sortBy", sortBy]);
		this.makeSabreAPICall(SABRE_API_INSTAFLIGHT, args, callback);
	},

	// gets info about an airport from a code
	airportCodeCache: {},

	getAirportFromCode: function(iataCode, callback) {
		var _this = this;

		// is it in the cache?
		if(this.airportCodeCache[iataCode] != null) {
			callback(this.airportCodeCache[iataCode]);
		} else {
	   		this.makeSitaAPICall(iataCode, [], function(airport) {
	   			_this.airportCodeCache[iataCode] = airport;

	   			callback(airport);

	   			console.log(_this.airportCodeCache);
	   		});
	   	}
	}
});
