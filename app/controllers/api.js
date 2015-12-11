app.controller("apiController", ["$scope", "$window", "$firebaseArray", 
	function ($scope, $window, $firebaseArray) { 
	
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
	
		//create autocomplete object.
		var autocomplete = new $window.google.maps.places.Autocomplete(input, $scope.markersArray);

		//Get complete address on enter key.
		if (keyEvent.which === 13) {
		$scope.markersArray.pop();	
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
		
		//create autocomplete object.
		var autocomplete = new $window.google.maps.places.Autocomplete(input, $scope.markersArray);

		//Get complete address on enter key.
		if (keyEvent.which === 13) {			
			//getting the input string as address for geocoder.
			address = document.getElementById('to').value;
			// console.log("address", address);
			//passing address to destinationA for distance matrix.
			destinationA = address;
			// console.log("destinationA", destinationA);
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
	        	$scope.markersArray.push(new google.maps.Marker({
	            map: map,
	            position: results[0].geometry.location,
	            zoom: 10,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        }));
	        //setting new position from geocoder for distance matrix variables.
	    	origin1 = $scope.markersArray[0].position;	        
	    	
	    	//setting second array for distance matrix.  	
	      	} else {
	        	alert("Geocode was not successful for the following reason: " + status);
	      			}
      		if ($scope.markersArray.length === 2) {
				//setting new position from geocoder for distance matrix variables.
    			destinationB = $scope.markersArray[1].position;
    			$scope.GetMatrix();
				}
	    	});
		};
		
		//getting new format of the geo code address and running Distance Matrix
		$scope.GetMatrix = function() {	
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
		      	var originList = response.originAddresses;
		      	var destinationList = response.destinationAddresses;
		      	// console.log("originList", originList);
		      	// console.log("destinationList", destinationList);
		      	//Defining variables to outPut to dom.
		      	// var outputDiv = document.getElementById('output');
		      	// outputDiv.innerHTML = '';
		      	// deleteMarkers(markersArray);
		    	}//end of else
			
			//Getting the time and distance based on geocode!
			for (var i = 0; i < originList.length; i++) {
				//ORIGIN DATA
				//getting distane and duration
        		var results = response.rows[i].elements;
        		geocoder.geocode({'address': originList[i]}, function(results, status) {
        			//geocoder.geocode needs to pass two arguments otherwise, it will error.
        		});
        		// console.log("originList", originList);
        		
        		//DESTINATION DATA
        		for (var j = 0; j < results.length; j++) {
          			geocoder.geocode({'address': destinationList[j]}, function(results, status) {
          				//geocoder.geocode needs to pass two arguments otherwise, it will error.
          			});
          			// console.log("destinationList", destinationList);

          			//Output
          	 		// $scope.outputDiv += originList[i] + ' to ' + destinationList[j] +
           	  //   	': ' + results[j].distance.text + ' in ' +
            	 //   	results[j].duration.text + '<br>';
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
			var inputRouteName = document.getElementById('route-name');
			var routeName = inputRouteName.toLowerCase();
			//firebase refrences to correct path
			var ref = new Firebase("https://commutealert.firebaseio.com/routes");
			var routesRef = new Firebase("https://commutealert.firebaseio.com/routes");
			// Getting user info
			var userId = ref.getAuth().uid;

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
			
}]);//end of controller




