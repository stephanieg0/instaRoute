app.controller("apiController", ["$scope", "$window", "$firebaseArray", 
	function ($scope, $window, $firebaseArray) { 

	console.log("controller is linked");

	var from = "";
	var to = "";
	var map = "";
	var mapOptions = {}
	var geocoder = "";
	var address = "";
	var marker = ""; 
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

		//geocoder instance for making address into coordinates.
		geocoder = new google.maps.Geocoder();
		
	};

	//setting autocomplete function for input field.
	$scope.placesFrom = function (keyEvent) {	
		//get the html element input for the autocomplete
		var input = document.getElementById('from');
		// console.log("input", input);
		//deafult bounds to deafult to places in Nashville first.
		mapOptions = {
			position: myLatLng,
    		map: map,
		}
		//create autocomplete object.
		var autocomplete = new $window.google.maps.places.Autocomplete(input, marker);

		//Get complete address on enter key.
		if (keyEvent.which === 13) {
			//getting the input string as address.
			address = document.getElementById('from').value;
			console.log("address", address);
			//passing map object and geocoder instance to function.
			$scope.geocodeAddress(geocoder, map);
		}//end if.

	};//end of placesFrom function.

	//setting autocomplete function for input field.
	$scope.placesTo = function (keyEvent) {
		//get the html element input
		var input = document.getElementById('to');
		console.log("input", input);
		//deafult bounds to deafult to places in Nashville first.
		mapOptions = {
			position: myLatLng,
    		map: map,
		}
		//create autocomplete object.
		var autocomplete = new $window.google.maps.places.Autocomplete(input, marker);

		//Get complete address on enter key.
		if (keyEvent.which === 13) {
			//getting the input string as address.
			address = document.getElementById('to').value;
			console.log("address", address);
			//passing map object and geocoder instance to function.
			$scope.geocodeAddress(geocoder, map);
		}//end if.

	};//end of placesTo function.

	//changin the marker position
	$scope.geocodeAddress = function (geocoder, map) {
		console.log("geocoderAdress:", address);
		//pushing address key into the geocode from google to get coordinates and change the map.		
		geocoder.geocode( { 'address': address}, function(results, status) {
	      if (status == google.maps.GeocoderStatus.OK) {
	        map.setCenter(results[0].geometry.location);
	        var marker = new google.maps.Marker ({
	            map: map,
	            position: results[0].geometry.location,
	            zoom: 8,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        });
	      } else {
	        alert("Geocode was not successful for the following reason: " + status);
	      }

	    });
	};


		

}]);//end of controller