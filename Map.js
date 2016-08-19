// The google map
var globalMap;
// Array of the created airport markers (used so we only create one per airport)
var markers = [];

$(function() {

var MapFcns = {
	// Function to load the two dropdown lists, one for code and one for location.
	// Each dropdown will use the other value as its tooltip
    loadSiteList: function () {
        var airportListByCode = $('#airport-list-by-code');
        airportListByCode.html('');
        airportListByCode.append('<option value=""></option>');
		sites.sort(function(a, b) {return a.Code > b.Code});
        for (var i in sites) {
			var location = sites[i].City + ', ' + sites[i].State;
            var newOption = '<option value="' + sites[i].Code + '" title="' + location + '">' + sites[i].Code + '</option>';
            airportListByCode.append(newOption);
        }
		var airportListByLocation = $('#airport-list-by-location');
        airportListByLocation.html('');
        airportListByLocation.append('<option value=""></option>');
 		sites.sort(function(a, b) {return a.City > b.City});
        for (var i in sites) {
			var location = sites[i].City + ', ' + sites[i].State;
            var newOption = '<option value="' + location  + '" title="' + sites[i].Code + '">' + location + '</option>';
            airportListByLocation.append(newOption);
        }
   },
    // Following two methods are called when the dropdown selection is updated.  They will keep the other dropdown in sync,
	// and we use the two dropdowns to display the important information about the airports (code and location)
    siteListCodeChange: function() {
        var ctl = $(this);
        airportCode = ctl.val();
        if (airportCode) {				
            var currAirport = _.findWhere(sites, {Code: airportCode});
			MapFcns.siteListChange(currAirport);
 				
			// Make the corresponding selection in the other dropdown
			var location = currAirport.City + ', ' + currAirport.State;
			$('#airport-list-by-location').val(location);
        }
    },
    siteListLocationChange: function() {
        var ctl = $(this);
		var value = ctl.val();
		if (value) {
			var location = value.split(",");
			var city = location[0];
			var state = location[1].substr(1);
			var currAirport = _.findWhere(sites, {City: city, State : state});
			MapFcns.siteListChange(currAirport);
 				
			// Make the corresponding selection in the other dropdown
			$('#airport-list-by-code').val(currAirport.Code);
		}
	},
	// Common function shared by the two above methods
    siteListChange: function(currAirport) {
		// This was the code to fill out the table, but it's no longer used since that <div> is hidden
		// and the info is in the dropdowns and the marker tooltip.
        $('#setting-code').text(currAirport.Code);
        $('#setting-city').text(currAirport.City);
        $('#setting-state').text(currAirport.State);
        $('#setting-fullname').text(currAirport.FullSiteName);
        $('#setting-lat').text(currAirport.Latitude);
        $('#setting-long').text(currAirport.Longitude);
               
	    // Create a new marker for the airport, if this is the first time we've selected it.
		var marker = MapFcns.findMarker(currAirport.Code);
		if (marker == null) {
			// Trim the Prefix from the full name (assuming it always starts with AIRPORT_XXX_)
			var fullname = currAirport.FullSiteName.substr(12);
			// Add a leading '+' to the coordinates if not supplied
			var lat = currAirport.Latitude;
			var sign = String(lat).substr(0, 1);
			if ((sign != "+") && (sign != "-")) {
				lat = "+" + lat;
			}
			var longitude = currAirport.Longitude;
			var sign = String(longitude).substr(0, 1);
			if ((sign != "+") && (sign != "-")) {
				longitude = "+" + longitude;
			}
			var tooltip = "Airport Name: " + fullname  + "\n" +
						  "Airport Code: " + currAirport.Code + "\n" +
						  "Coordinates: " + lat + longitude;
			marker = new google.maps.Marker({
				position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
				map: globalMap,
				title: tooltip});
			var savedMarker = {code: currAirport.Code, marker : marker};	
			markers.push(savedMarker);
		}
		// Show the marker (in case it was previously hidden) and center the map on that location.
		marker.setMap(globalMap);
 		globalMap.setCenter(marker.getPosition());
		
		// The first time we show a marker, we unhide the button that allows the marker to be hidden/shown
		if (markers.length == 1) {
			$('#markerToggle').show();
			$('#markerToggle').click(MapFcns.toggleMarker);
		}
	    $('#markerToggle').html("Hide Marker");
   },
	
	// Function to hide/show the marker and update the label for the toggle buton
	toggleMarker : function () {
		var code = $('#airport-list-by-code').val();
		var marker = MapFcns.findMarker(code);
		if (marker.getMap() == null) {
			marker.setMap(globalMap);
 		    $('#markerToggle').html("Hide Marker");
		} else {
			marker.setMap(null);
 		    $('#markerToggle').html("Show Marker");
		}
	},
	
	// Convenience function to look for an existing marker
	findMarker : function (code) {
 	    var savedMarker = _.findWhere(markers, {code: code});
		return (savedMarker == null) ? null : savedMarker.marker;
	}
}


MapFcns.loadSiteList();
$('#airport-list-by-code').change(MapFcns.siteListCodeChange);
$('#airport-list-by-location').change(MapFcns.siteListLocationChange);
$('#exercise-toggle').click(function() {
    var  toggleCtl = $(this),
         toggleVal = toggleCtl.text();
    if (toggleVal == '-') {
        toggleCtl.text('+');
        $('#exercise-instructions').hide();
    } else {
        toggleCtl.text('-');
        $('#exercise-instructions').show();
    }
});

});







    
function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
  
}
