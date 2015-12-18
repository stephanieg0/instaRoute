app.controller("apiController", ["$scope", "$window", "$firebaseArray", "getUid", '$cookies',
	function ($scope, $window, $firebaseArray, idFactory, $cookies) { 

	//getting back the current user data from factory after log in.
	$scope.userData = idFactory.getUid();
	$scope.userId = $scope.userData.uid;

  	// Setting a cookie to remember user id upon page refresh.
  	//if user id is falsy(which it will be when page is refreshed), 
  	//then get the cookie, which has the id saved.
  	if (!$scope.userId) { 
  		$scope.userId = $cookies.get('userId');
  	} else {
  		//else, if user id "is" defined, then redefine the cookie to the current user id.
  		$cookies.put('userId', $scope.userId);
  	}
  	
	//Loading routes from firebase and defining scope route for html binding.
	var ref = new Firebase("https://commutealert.firebaseio.com/routes");
	$scope.routes = $firebaseArray(ref);
	//console.log("$scope.routes", $scope.routes);
	$scope.routes.currentRoute = {};

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
  	//Id from firebase to be defined.
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
		//map instances for display.
		$scope.directionsService = new google.maps.DirectionsService;
  		$scope.directionsDisplay = new google.maps.DirectionsRenderer;
  		$scope.directionsDisplay.setMap(map);
		//geocoder instance for making address into coordinates.
		geocoder = new google.maps.Geocoder();
		//distance matrix instance to get time from origin to destination.
		service = new google.maps.DistanceMatrixService;		
		
		var trafficLayer = new google.maps.TrafficLayer();
  		trafficLayer.setMap(map);
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
			//getting the input string as address for geocoder.
			//and passing address to origin2 for distance matrix.
			origin2 = document.getElementById('from').value;

			//passing map object and geocoder instance to function.
			$scope.geocodeAddress(geocoder, map, origin2);
			$scope.routes.currentRoute = {
				"timeDuration": "",
				"routeSummary": ""
			}
			
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
			//and passing address to destinationA for distance matrix.
			destinationA = document.getElementById('to').value;

			//passing map object and geocoder instance to function.
			$scope.geocodeAddress(geocoder, map, destinationA);
		}//end if.
	};//end of placesTo function.

	//This is the saved individual route origin and destination info.
	//*** I need to wait until origin has gone through the geocode address and give coordinates, 
	//and then pass the destination.
	$scope.GetTime = function(origin, destination) {	
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
				}//end of loop.		
			//** if geocoder does not have address, give an error.	
	    	}else {
	        	alert("Geocode was not successful for the following reason: " + status);	
      		}
	      	//** if the markers array contains 2 objects, call GetMatrix function for distance and time.
      		if ($scope.markersArray.length === 2) {
     			$scope.GetMatrix();
     			$scope.calculateAndDisplayRoute($scope.directionsService, $scope.directionsDisplay);
     			console.log("geocode $scope.directionsService", $scope.directionsService);
			}
    	});//end of geocoder.geocode()
			
	};//end of geocodeAddress.

	//** Route map display.
	$scope.calculateAndDisplayRoute = function(directionsService, directionsDisplay) {
		
		$scope.directionsService = directionsService;
		$scope.directionsDisplay = directionsDisplay;

		$scope.directionsService.route({
			origin: origin2,
			destination: destinationA,
			travelMode: google.maps.TravelMode.DRIVING
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				$scope.directionsDisplay.setDirections(response);
				console.log("response", response);
				//console.log("response.routes[0].summary", response.routes[0].summary);
			} else {
		  		window.alert('Directions request failed due to ' + status);
			}
			for (var i = 0; i < response.routes.length; i++){
				// console.log("route summay", response.routes[i].summary);
				
				$scope.routes.currentRoute.routeSummary = response.routes[i].summary;
				console.log("$scope.routes.currentRoute.routeSummary", $scope.routes.currentRoute.routeSummary);
				
			}

		$scope.$apply();
		});

	};


		
	//** Getting time and distance from geocodeAddress origin and destination format.
	$scope.GetMatrix = function() {
		//console.log("this is GetMatrix");
		service.getDistanceMatrix({
	    origins: [origin1, origin2],
	    destinations: [destinationA, destinationB],
	    travelMode: google.maps.TravelMode.DRIVING,
	    unitSystem: google.maps.UnitSystem.METRIC,
	    avoidHighways: false,
	    avoidTolls: false,

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
    		
    			//Destination List
    			for (var j = 0; j < results.length; j++) {

      			geocoder.geocode({'address': destinationList[j]}, function(results, status) {
      				//geocoder.geocode needs to pass two arguments otherwise, it will error.
      			});
      			//if $scope.routes.currentRoute.timeDuration is found and equals to empty string, then assgin duration.	

	        	console.log("$scope.routes.currentRoute.timeDuration", $scope.routes.currentRoute.timeDuration);
	        	$scope.routes.currentRoute.timeDuration = results[j].duration.text;
      			        	 	        		
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
		});//response, status function.
	};//end of function


	//Saving a route to firebase.
	$scope.SaveRoute = function() {
		
		//console.log("origin1", origin1);
		//console.log("destinationB", destinationB);
		//get the html element input for the autocomplete
		var routeName = document.getElementById('route-name').value;
		//firebase refrences to correct path
		var routesRef = new Firebase("https://commutealert.firebaseio.com/routes");
	
		//pushing route info to firebase
		routesRef.push({
			"routeName": routeName,
			"userId": $scope.userId,
			"origin2": origin2,
			"destinationA": destinationA,
			"timeDuration": "",
			"routeSummary": ""
		});
		//clearing input values after clicking "create route".
		document.getElementById('route-name').value = "";
		document.getElementById('to').value = "";
		document.getElementById('from').value = "";	
	};


	//Deleting from firebase
	$scope.DeleteRoute = function(route) {
		$scope.routes.$remove(route);
		//console.log(route, "removed");
	};

	//LogOut
	$scope.LogOut = function() {		
		//deafult map options to reset the map.
		mapOptions =  {
	    	center: myLatLng,
	    	zoom: 10
	  	}
		//Reseting the map when loggin out.
		map = new google.maps.Map(document.getElementById('map'), mapOptions);	
		//reseting map instances for display.
		$scope.directionsService = new google.maps.DirectionsService;
  		$scope.directionsDisplay = new google.maps.DirectionsRenderer;
  		$scope.directionsDisplay.setMap(map);

  		var trafficLayer = new google.maps.TrafficLayer();
  		trafficLayer.setMap(map);

  		//user logged out. 
		ref.unauth();
	};		

	//Getting departure time from user input.
	$scope.DepartureTime = function(index, origin, destination){
		//getting specific addresses to re-run.
		origin2 = origin;
		destinationA = destination;
	
		//getting class name by index.
		var el = document.getElementsByClassName(index);
		console.log("el", el);
		//getting the specific value of current selected.
		for (var i = 0; i < el.length; i++){
			var DepartureTimeInput = el[i].value;
			console.log("DepartureTimeInput", DepartureTimeInput);

		}
	};

	//Getting time
	var DepartureTime = "7:54:0";
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var seconds = currentTime.getSeconds();

	if (hours > 12) {
	    hours -= 12;
	} else if (hours === 0) {
	   hours = 12;
	}
	
	var timeString = hours + ":" + minutes + ":" + seconds;
	//console.log("timeString", timeString);
	var t = setTimeout($scope.SetTime, 500);

	if (DepartureTime === timeString){
		alert("hello");
	}
	
		



}]);//end of controller




