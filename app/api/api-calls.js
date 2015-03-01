/**
 * API Calls for Find Me An Adventure
 *
 * HackDFW 2015
 *
 */

SABRE_API_KEY = "Bearer Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTD!ICESMSLB\/CRT.LB!-0123456789012345678!123456!0!ABCDEFGHIJKLM!E2E-1";

SABRE_API_BASE_URL = "https://api.test.sabre.com/";
SABRE_API_VERION = "v1/";

SABRE_API_DESTINATION_FINDER = "shop/flights/fares/";
SABRE_API_TRAVEL_THEME_LOOKUP = "lists/supported/shop/themes/";
SABRE_API_AIRPORT_AT_CITY_LOOKUP = "lists/supported/cities/";

SITA_API_KEY = "e690a6ebac2897d2d20a40f3c1eacb40";

SITA_API_AIRPORT_URL = "https://airport.api.aero/airport/"
SITA_API_AIRPORT_NEAREST = "nearest/"

JSONP_PROXY_URL="https://jsonp.nodejitsu.com/"

function makeSabreAPICall(base, args, callback){
    var arrs = "";
    if(args.length > 0){
        var resp = [];
        $.map(args, function(obj, index){
            if(obj[1] != null){
                resp.push(obj[0] + "=" + obj[1]);
            }
        });
        arrs = resp.join("&");
    }
    $.ajax(SABRE_API_BASE_URL + SABRE_API_VERION + base, {
        headers: { 'Authorization': SABRE_API_KEY },
        data: arrs,
        error: function(jqXHR, textStatus, errorThrown){ callback(null); },
        success: function(data, dataType, dataFilter){ callback(data); }
    });
}

function makeRawSabreAPICall(url, callback){
	$.ajax(url, {
        headers: { 'Authorization': SABRE_API_KEY },
        error: function(jqXHR, textStatus, errorThrown){ callback(null); },
        success: function(data, dataType, dataFilter){ callback(data); }
    });
}

function makeSitaAPICall(base, args, callback){
    args.push(["user_key", SITA_API_KEY])
    if(args.length > 0){
        var resp = [];
        $.map(args, function(obj, index){
            if(obj[1] != null){
                resp.push(obj[0] + "=" + obj[1]);
            }
        });
        arrs = resp.join("%26");
    }
    $.ajax(JSONP_PROXY_URL, {
        data: "url=" + SITA_API_AIRPORT_URL + base + "?" + arrs,
        error: function(jqXHR, textStatus, errorThrown){ callback(null); },
        success: function(data, dataType, dataFilter){ callback(data); }
    });
}

function getThemeObjects(callback){
    this.makeSabreAPICall(SABRE_API_TRAVEL_THEME_LOOKUP, [], callback);
}

function lookupAirportByTheme(theme, callback){
    this.makeSabreAPICall(SABRE_API_TRAVEL_THEME_LOOKUP + theme, [], callback);
}

function lookupDestination(origin, theme, lengthOfStay,
                              earliestDepartureDate, maxFare,
                              region, topDestinations, callback){
    args = [
        ["origin",origin],
        ["theme",theme],
        ["lengthofstay",lengthOfStay],
        ["earliestdeparturedate",earliestDepartureDate],
        ["maxFare",maxFare],
        ["region",region],
        ["topdestinations",topDestinations]
    ];
    this.makeSabreAPICall(SABRE_API_DESTINATION_FINDER, args, callback);
}

function getAirportsInCity(cityCode, callback){
    this.makeSabreAPICall(SABRE_API_AIRPORT_AT_CITY_LOOKUP
                + cityCode + "/airports/", [], callback);
}

function getAirportsNearest(lat, lng, maxAirports, callback){
    this.makeSitaAPICall(SITA_API_AIRPORT_NEAREST
                    + lat + "/" + lng, [["maxAirports", maxAirports]], callback);
}

function getAirportFromCode(iataCode, callback){
    this.makeSitaAPICall(iataCode, [], callback);
}
