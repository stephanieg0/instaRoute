app.controller("apiController", ["$scope", "$window", "$firebaseArray", "$q", 
	function ($scope, $window, $firebaseArray, Q) { 

	//variables for the inputHTML.
	var fromInput = "";
	var toInput = "";
	//variables for google instances and objects.
	$scope.map = "";
	var mapOptions = {}
	$scope.geocoder = "";
	$scope.service = "";
	//variable to get whole address for geocoder.
	var address = "";
	//array to have more than one marker who up in the map.
	$scope.markersArray = []; 
	//setting global latitude and longitud. Deafult to Nashville.Needed to show map.
	var myLatLng = {lat: 36.166361, lng: -86.781167};
	//variables for google's distance matrix.
	//my origin in address form and coordinates.
	var origin1 = {lat: 55.93, lng: -3.118};
  	var origin2 = 'Greenwich, England';
  	//my destination in address form and coordinates.
  	var destinationA = 'Stockholm, Sweden';
  	var destinationB = {lat: 50.087, lng: 14.421};
  	//output for dom.
  	$scope.outputDiv = "";

	//initializing the map when app loads(part of the script tag in html). 
	//Deafult to Nashville
	$window.initMap = function () {
		//deafult for map
		mapOptions =  {
	    center: myLatLng,
	    zoom: 10
	  }
	 	//creates a map inside the map div
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		//marker deafult
		$scope.markersArray.push(new google.maps.Marker({
		    position: myLatLng,
		    map: map,
		    title: 'Hello World!'
		  }));

		//geocoder instance for making address into coordinates.
		geocoder = new google.maps.Geocoder();
		//distance matrix instance to get time from origin to destination.
		service = new google.maps.DistanceMatrixService;
		
	};

	//setting autocomplete function for input field.
	$scope.placesFrom = function (keyEvent) {		
		//get the html element input for the autocomplete
		var input = document.getElementById('from');
		//to use globally
		fromInput = input;
	
		//create autocomplete object.
		var autocomplete = new $window.google.maps.places.Autocomplete(input, $scope.markersArray);

		//Get complete address on enter key.
		if (keyEvent.which === 13) {			
		// $scope.markersArray.pop();	
			//getting the input string as address for geocoder.
			address = document.getElementById('from').value;
			
			//passing address to origin2 for distance matrix
			origin2 = address;

			//passing map object and geocoder instance to function.
			$scope.geocodeAddress(geocoder, map);
			
		}//end if.
	};//end of placesFrom function.

	//setting autocomplete function for input field.
	$scope.placesTo = function (keyEvent) {
		//get the html element input
		var input = document.getElementById('to');
		//to use input globally
		toInput = input;
		//create autocomplete object.
		var autocomplete = new $window.google.maps.places.Autocomplete(input, $scope.markersArray);

		//Get complete address on enter key.
		if (keyEvent.which === 13) {			
			//getting the input string as address for geocoder.
			address = document.getElementById('to').value;
			console.log("address", address);
			//passing address to destinationA for distance matrix.
			destinationA = address;
			// console.log("destinationA", destinationA);
			//passing map object and geocoder instance to function.
			$scope.geocodeAddress(geocoder, map);
		}//end if.
	};//end of placesTo function.

	//This is the saved individual route origin and destination info.
	$scope.SavedRoute = function(origin, destination) {
		//need to assign both origin and destination to address variable and pass it to geocoder.
		address = origin;
		origin2 = origin;
		
		$scope.geocodeAddress(geocoder, map).then(function(){
			console.log("should I call a promise??");
		});

		//*** I need to wait until origin has gone through the geocode address to define the destination.


	}//end of SavedRoute function.

	//changin the marker position
	$scope.geocodeAddress = function (geocoder, map) {

		console.log("geocoderAdress:", address);
		//pushing address key into the geocode from google to get coordinates and change the map.		
		geocoder.geocode( { 'address': address}, function(results, status) {
	      if (status == google.maps.GeocoderStatus.OK) {
	        map.setCenter(results[0].geometry.location);
	        	$scope.markersArray.push(new google.maps.Marker({
	            map: map,
	            position: results[0].geometry.location,
	            zoom: 10,
	            mapTypeId: google.maps.MapTypeId.ROADMAP        
	        	}));//end of Marker
	        	console.log("$scope.markersArray", $scope.markersArray);
	        	console.log("origin2", origin2);
			    //** getting the position from orign and destination in any given order.
			    for (var i = 0; i < $scope.markersArray.length; i++) {
					// console.log("loop markersArray", $scope.markersArray[i].position);
					//** If the address matches the origin input, assign the current position to the origin.
					if (origin2 === address){
					origin1	= $scope.markersArray[i].position;
					console.log("origin2", origin2);
					//** If the address matched the destination, assign the current position to the destination.
					} if (destinationA === address) {
						destinationB = $scope.markersArray[i].position;
						console.log("destinationA", destinationA);
					}
				}//end of loop
			//** if geocoder does not have address give an error.	
	        }else {
	        	alert("Geocode was not successful for the following reason: " + status);	
	      		}
	      	//** if the markers array contains 2 objects, call GetMatrix function for distance and time.
      		if ($scope.markersArray.length === 2) {
     			$scope.GetMatrix();
				}
	    	});
		};
		
	//** Getting time and distance from geocodeAddress origin and destination format.
	$scope.GetMatrix = function() {	
		//** need both origin and destination to be defined first.
		service.getDistanceMatrix({
	    origins: [origin1, origin2],
	    destinations: [destinationA, destinationB],
	    travelMode: google.maps.TravelMode.DRIVING,
	    unitSystem: google.maps.UnitSystem.METRIC,
	    avoidHighways: false,
	    avoidTolls: false
	  }, function(response, status) {
	    if (status !== google.maps.DistanceMatrixStatus.OK) {
	      alert('Error was: ' + status);
	    } else {
	    	//** new list/format of the origin and destination.
	      	var originList = response.originAddresses;
	      	var destinationList = response.destinationAddresses;
	      	console.log("originList", originList);
	      	console.log("destinationList", destinationList);
	    	}//end of else
		
		//Origin List
		//** the new origin format is an array. 
		for (var i = 0; i < originList.length; i++) {
			//Getting distance and duration for origin and destination
    		var results = response.rows[i].elements;
    		//console.log("results", results);
    		geocoder.geocode({'address': originList[i]}, function(results, status) {
    			//geocoder.geocode needs to pass two arguments otherwise, it will error.
    		});
    		// console.log("originList", originList);
    		
    		//Destination List
    		for (var j = 0; j < results.length; j++) {

      			geocoder.geocode({'address': destinationList[j]}, function(results, status) {
      				//geocoder.geocode needs to pass two arguments otherwise, it will error.
      			});
      			// console.log("destinationList", destinationList);

      			//Output	
      	 		// $scope.outputDiv += originList[i] + ' to ' + destinationList[j] +
       	  		//': ' + results[j].distance.text + ' in ' +
        	    //results[j].duration.text + '<br>';
        	 	$scope.outputDiv = results[j].duration.text;
       			// console.log("outputDiv", $scope.outputDiv);
       			console.log("results[j].duration", results[j].duration.text);
   				}
			}
			//the scope needs to be applied so the outputDiv can show up because of the nested forloops.
   			$scope.$apply();
			});
		};//end of function


	//Saving to firebase
	$scope.SaveRoute = function() {
		//get the html element input for the autocomplete
		var routeName = document.getElementById('route-name').value;
		//firebase refrences to correct path
		var ref = new Firebase("https://commutealert.firebaseio.com/routes");
		var routesRef = new Firebase("https://commutealert.firebaseio.com/routes");
		// Getting user info
		var userId = ref.getAuth().uid;
		console.log("route name", routeName);
		//pushing route info to firebase
		routesRef.push({
				"routeName": routeName,
				"userId": userId,
				"origin2": origin2,
				"destinationA": destinationA
			});
		console.log("userId", ref.getAuth().uid);
		console.log("in firebase", origin2, destinationA);
			
	};

	//Loading from firebase
	var ref = new Firebase("https://commutealert.firebaseio.com/routes");
	$scope.routes = $firebaseArray(ref);


	//Deleting from firebase
	$scope.DeleteRoute = function(route) {
		$scope.routes.$remove(route);
		console.log(route, "removed");
	};

		
			
}]);//end of controller




