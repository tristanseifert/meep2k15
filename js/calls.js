
SABRE_API_BASE_URL = "https://api.test.sabre.com/";
SABRE_API_VERION = "v1/";

CONFIG_API_AUTH = "Bearer Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTD!ICESMSLB\/CRT.LB!-0123456789012345678!123456!0!ABCDEFGHIJKLM!E2E-1";

SABRE_API_DESTINATION_FINDER_BASE = "shop/flights/fares/";
SABRE_API_TRAVEL_THEME_LOOKUP_BASE = "lists/supported/shop/themes/";
SABRE_API_TRAVEL_AIRPORT_LOOKUP_BASE = "lists/supported/shop/themes/";
SABRE_API_AIRPORT_AT_CITY_LOOKUP_BASE = "list/supported/cities/";

function makeAPICall(base, args, callback){
    var resp = "";
    if(args.length > 0){
        resp = args[0][0] + "=" + args[0][1];
        for (var i = 1; i < args.length ; i++) {
            resp += ("&" + args[i][0] + "=" + args[i][1]);
        }
    }
    $.ajax(SABRE_API_BASE_URL + SABRE_API_VERION + base, {
        headers: { 'Authorization': CONFIG_API_AUTH },
        data: resp,
        error: function(jqXHR, textStatus, errorThrown){ callback(null); },
        success: function(data, dataType, dataFilter){ callback(data); }
    });
}

function apiGetThemeObjects(callback){
    makeAPICall(SABRE_API_TRAVEL_AIRPORT_LOOKUP_BASE, [], callback);
}

function apiAirportLookupByTheme(theme, callback){
    makeAPICall(SABRE_API_TRAVEL_AIRPORT_LOOKUP_BASE + theme, [], callback);
}

function apiLookupDestination(origin, theme, earliestDepartureDate, maxFare, region, topDestinations){
    
}

function apiGetAirportsInCity(cityCode, callback){
    makeAPICall(cityCode + "/airports/", [], callback);
}
