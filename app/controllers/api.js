app.controller("apiController", ["$scope", "$window", "$firebaseArray", "$q", 
	function ($scope, $window, $firebaseArray, $q) { 

	//Loading from firebase and defining scope route for html binding
	var ref = new Firebase("https://commutealert.firebaseio.com/routes");
	$scope.routes = $firebaseArray(ref);
	//variables for the inputHTML.
	var fromInput = "";
	var toInput = "";
	//variables for google instances and objects.
	$scope.map = "";
	var mapOptions = {}
	$scope.geocoder = "";
	$scope.service = "";
  	$scope.directionsService = "";
  	$scope.directionsDisplay = "";
	//variable to get whole address for geocoder.
	var address = "";
	//array to have more than one marker in the map.
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

  	var counter = 0;

  	$scope.currentRouteID = "";



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
		    title: 'Deafult Marker'
		  }));
		
		//geocoder instance for making address into coordinates.
		geocoder = new google.maps.Geocoder();
		//distance matrix instance to get time from origin to destination.
		service = new google.maps.DistanceMatrixService;
		// var trafficLayer = new google.maps.TrafficLayer();
     	//	trafficLayer.setMap(map);
		
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
			//removing the deafult array. to find it I look for the title property.
			for (var i = 0; i < $scope.markersArray.length; i++) {
				//if the title property equals the deafult marker, get the index of that element.
				if ($scope.markersArray[i].title === "Deafult Marker"){
					//console.log("index of deafult array", i);
					//remove the index of the element that had the title property.
					$scope.markersArray.splice(i, 1);
				}
			}//end of loop.			
			//getting the input string as address for geocoder.
			//and passing address to origin2 for distance matrix.
			origin2 = document.getElementById('from').value;
			
			//passing map object and geocoder instance to function.
			$scope.geocodeAddress(geocoder, map, origin2);
			
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
			//removing the deafult array. to find it I look for the title property.
			for (var i = 0; i < $scope.markersArray.length; i++) {
				//if the title property equals the deafult marker, get the index of that element.
				if ($scope.markersArray[i].title === "Deafult Marker"){
					// console.log("index of deafult array", i);
					//remove the index of the element that had the title property.
					$scope.markersArray.splice(i, 1);
				}
			}//end of loop.				
			//getting the input string as address for geocoder.
			//and passing address to destinationA for distance matrix.
			destinationA = document.getElementById('to').value;

			//passing map object and geocoder instance to function.
			$scope.geocodeAddress(geocoder, map, destinationA);
		}//end if.
	};//end of placesTo function.

	//This is the saved individual route origin and destination info.
	//*** I need to wait until origin has gone through the geocode address and give coordinates, 
	//and then pass the destination.
	$scope.SavedRouteFirebase = function(origin, destination) {	
		console.log("origin", origin);
		console.log("destination", destination);
		//removing the deafult array. to find it I look for the title property.
		for (var i = 0; i < $scope.markersArray.length; i++) {
			//if the title property equals the deafult marker, get the index of that element.
			if ($scope.markersArray[i].title === "Deafult Marker"){
				// console.log("index of deafult array", i);
				//remove the index of the element that had the title property.
				$scope.markersArray.splice(i, 1);
			}
		}
		//need to assign both origin and destination to address variable and pass it to geocoder.
		origin2 = origin;
		$scope.geocodeAddress(geocoder, map, origin);

		destinationA = destination;

		$scope.geocodeAddress(geocoder, map, destination);

		
		//getting the Selected/current Route in firebase.
		for (var i = 0; i < $scope.routes.length; i ++){
			if($scope.routes[i].origin2 === origin && $scope.routes[i].destinationA === destination){
				//specific id from firebase.
				$scope.currentRouteID = $scope.routes[i].$id;
				//specific route to determine time duration in distance Matrix output.
				$scope.routes.currentRoute = $scope.routes[i];
				//console.log("$scope.routes[i]", $scope.routes[i]);
				
			}
		}
		

	};//end of SavedRoute function.

	//changin the marker position
	$scope.geocodeAddress = function (geocoder, map, address) {		
		//console.log("geocodeAddress ADDRESS", address);
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
	        	console.log("$scope.markersArray in geocodeAddress", $scope.markersArray);
				//** getting the position from orign and destination in any given order.
				for (var i = 0; i < $scope.markersArray.length; i++) {
				// console.log("loop markersArray", $scope.markersArray[i].position);
				//** If the address matches the origin input, assign the current position to the origin.
					if (origin2 === address){
						origin1	= $scope.markersArray[i].position;
						//console.log("geocoderAddress origin1", origin1);
					//** If the address matched the destination, assign the current position to the destination.
					} if (destinationA === address) {
						destinationB = $scope.markersArray[i].position;
						//console.log("geocoderAddress destinationA", destinationA);
					}
				}//end of loop
				for (var i = 0; i < 2; i++){
					counter += i;
					//console.log("Geocoder COUNTER", counter);
				}
			//** if geocoder does not have address, give an error.	
	    	}else {
	        	alert("Geocode was not successful for the following reason: " + status);	
      		}
	      	//** if the markers array contains 2 objects, call GetMatrix function for distance and time.
      		if ($scope.markersArray.length === 2) {
     			$scope.GetMatrix();
     			$scope.calculateAndDisplayRoute($scope.directionsService, $scope.directionsDisplay);
			}
    	});//end of geocoder.geocode()
			
	};//end of geocodeAddress.

	//** Getting directions on the map.
	$scope.calculateAndDisplayRoute = function(directionsService, directionsDisplay) {
		$scope.directionsService = new google.maps.DirectionsService;
  		$scope.directionsDisplay = new google.maps.DirectionsRenderer;
  		$scope.directionsDisplay.setMap(map);		
		console.log("This is DirectionsService");
		console.log("origin2", origin2);
		console.log("destinationA", destinationA);
		$scope.directionsService.route({
			origin: origin2,
			destination: destinationA,
			travelMode: google.maps.TravelMode.DRIVING
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				$scope.directionsDisplay.setDirections(response);
				//console.log("response.routes[0].summary", response.routes[0].summary);
			} else {
		  		window.alert('Directions request failed due to ' + status);
			}
			for (var i = 0; i < response.routes.length; i++){
				//console.log("route summay", response.routes[i].summary);
			}
		$scope.$apply();
		});

	};


		
	//** Getting time and distance from geocodeAddress origin and destination format.
	$scope.GetMatrix = function() {
		console.log("this is GetMatrix");
		//** need both origin and destination to be defined first.
		// console.log("GetMatrix origin1", origin1);
		// console.log("GetMatrix origin2", origin2);
		// console.log("GetMatrix destinationA", destinationA);
		// console.log("GetMatrix destinationB, should not be 50 and 14", destinationB);
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
	      	// console.log("originList", originList);
	      	// console.log("destinationList", destinationList);
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
    		//console.log("originList", originList);
    		
    		//Destination List
    		for (var j = 0; j < results.length; j++) {

      			geocoder.geocode({'address': destinationList[j]}, function(results, status) {
      				//geocoder.geocode needs to pass two arguments otherwise, it will error.
      			});
      			//console.log("destinationList", destinationList);

      			//Output	
      	 		// $scope.outputDiv += originList[i] + ' to ' + destinationList[j] +
       	  		//': ' + results[j].distance.text + ' in ' +
        	    //results[j].duration.text + '<br>';
        	    
        	 	// $scope.timeDuration = results[j].duration.text;

        	 	//outputting to specific route.
        	 	

        	 	console.log("$scope.routes.currentRoute.timeDuration", $scope.routes.currentRoute.timeDuration);
        	 	$scope.routes.currentRoute.timeDuration = results[j].duration.text;
        	 	
       		
       			//console.log(originList[i] + ' to ' + destinationList[j] + ': ' + results[j].distance.text + ' in ' + results[j].duration.text);
   			}//end of loop
		}//end of loop
		//emptying markerArray.
		for (var i = 0; i < $scope.markersArray.length; i++) {
   					$scope.markersArray[i].setMap(null);
  				}
		$scope.markersArray = [];
		console.log("$scope.markersArray", $scope.markersArray);
		//the scope needs to be applied so the outputDiv can show up because of the nested forloops.
   		$scope.$apply();
		});//anonymous function
	};//end of function


	//Saving to firebase
	$scope.SaveRoute = function() {
		//console.log("origin1", origin1);
		//console.log("destinationB", destinationB);
		//get the html element input for the autocomplete
		var routeName = document.getElementById('route-name').value;
		//firebase refrences to correct path
		var ref = new Firebase("https://commutealert.firebaseio.com/routes");
		var routesRef = new Firebase("https://commutealert.firebaseio.com/routes");
		// Getting user info
		var userId = ref.getAuth().uid;
		//console.log("route name", routeName);
		//pushing route info to firebase
		routesRef.push({
			"routeName": routeName,
			"userId": userId,
			"origin2": origin2,
			"destinationA": destinationA,
			"timeDuration": ""
		});
	//console.log("userId", ref.getAuth().uid);
	//console.log("in firebase", origin2, destinationA);
			
	};


	//Deleting from firebase
	$scope.DeleteRoute = function(route) {
		$scope.routes.$remove(route);
		//console.log(route, "removed");
	};

	//LogOut
	$scope.LogOut = function() {
		ref.unauth();
		//console.log("logged out");
	};
		
			
}]);//end of controller




