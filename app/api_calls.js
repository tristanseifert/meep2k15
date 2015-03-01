
SABRE_API_BASE_URL                      = "https://api.test.sabre.com/";
SABRE_API_VERION                        = "v1/";

CONFIG_API_AUTH                         = "Bearer Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTD!ICESMSLB\/CRT.LB!-0123456789012345678!123456!0!ABCDEFGHIJKLM!E2E-1";

SABRE_API_DESTINATION_FINDER_BASE       = "shop/flights/fares/";
SABRE_API_TRAVEL_THEME_LOOKUP_BASE      = "lists/supported/shop/themes/";
SABRE_API_TRAVEL_AIRPORT_LOOKUP_BASE    = "lists/supported/shop/themes/";
SABRE_API_AIRPORT_AT_CITY_LOOKUP_BASE   = "lists/supported/cities/";

function makeAPICall(base, args, callback){
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
        headers: { 'Authorization': CONFIG_API_AUTH },
        data: arrs,
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

function apiLookupDestination(origin, theme, lengthOfStay,
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
    makeAPICall(SABRE_API_DESTINATION_FINDER_BASE, args, callback);
}

function apiGetAirportsInCity(cityCode, callback){
    makeAPICall(SABRE_API_AIRPORT_AT_CITY_LOOKUP_BASE + cityCode + "/airports/", [], callback);
}
