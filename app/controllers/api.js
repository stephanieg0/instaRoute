app.controller("apiController", ["$scope", "$window", "$firebaseArray", 
	function ($scope, $window, $firebaseArray) { 

	console.log("controller is linked");

	var from;
	var to;

	var map;
	//initializing the map
	$window.initMap = function () {
		var mapPotions =  {
	    center: {lat: 36.1667, lng: 86.7833},
	    zoom: 8,
	    disableDefaultUI: true
	  }
	  map = new google.maps.Map(document.getElementById('map'), mapPotions);
	};

	$scope.Calculate = function () {
		console.log("click works");
		from = document.getElementById('from').value;
		// to = document.getElementById('to').value;
		// console.log("from", from);
		
		

	}

	$scope.Places = function (fromInput) {
		//get the html element input
		var input = fromInput;
		console.log("input", input);
		// var autocomplete = new google.maps.places.Autocomplete(document.getElementById('from').value);
		console.log("Places function ran");
		//bounds for the autocomplete search results.
		var deafultBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(-90, 91),
			new google.maps.LatLng(-180, 80));

		var options = {
			bounds: deafultBounds,
			types: ['establishment']
		};

	
		//placing input on top left of map.
		// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		//create autocomplete object.
		var autocomplete = new google.maps.places.Autocomplete(input, options);

			
	};

		

}]);//end of controller