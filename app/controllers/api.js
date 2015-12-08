app.controller("apiController", ["$scope", "$window", "$firebaseArray", 
	function ($scope, $window, $firebaseArray) { 

	console.log("controller is linked");

	var from;
	var to;
	var map;
	var mapOptions = {}
	var geocoder;
	var address;
	var marker; 
	//setting global latitude and longitud. Deafult to Nashville.
	var myLatLng = {lat: 36.166361, lng: -86.781167};

	//initializing the map. Deafult to Nashville
	$window.initMap = function () {
		//deafult for map
		mapOptions =  {
	    center: myLatLng,
	    zoom: 8
	  }
	 	//creates a map inside the map div
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		//marker deafult
		marker = new google.maps.Marker({
		    position: myLatLng,
		    map: map,
		    title: 'Hello World!'
		  });


	};

	//changin the marker position
	$scope.geocodeAddress = function (geocoder, map) {
		console.log("resultsMap", map);
		
		// geocoder = new $window.google.maps.Geocoder();

		geocoder.geocode( { 'address': address}, function(results, status) {
	      if (status == google.maps.GeocoderStatus.OK) {
	        map.setCenter(results[0].geometry.location);
	        mapOptions = {
	            map: map,
	            position: results[0].geometry.location,
	            zoom: 8,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        }
	      } else {
	        alert("Geocode was not successful for the following reason: " + status);
	      }
	    });
	};


	//setting autocomplete function for input field.
	$scope.placesFrom = function () {
		//get the html element input for the autocomplete
		var input = document.getElementById('from');
		console.log("input", input);
		//getting the input string as address.
		address = document.getElementById('from').value;
		console.log("address", address);

		mapOptions = {
			position: myLatLng,
    		map: map,
		}
		//create autocomplete object.
		var autocomplete = new $window.google.maps.places.Autocomplete(input, marker);
		console.log("autocomplete", autocomplete);

	};//end of placesFrom function

	




		$scope.placesTo = function () {
		//get the html element input
		var input = document.getElementById('to');
		
		//bounds for the autocomplete search results.
		var deafultBounds = new google.maps.LatLngBounds(
			//rectangle in map for south, west and north
			new google.maps.LatLng(36.166361, -86.781167));
			// new google.maps.LatLng(-180, 80));

		mapOptions = {
			bounds: deafultBounds,
			zoom: 8
		};


		//create autocomplete object.
		var autocomplete = new $window.google.maps.places.Autocomplete(input, options);
		console.log("autocomplete", autocomplete);

			
	};

		

}]);//end of controller