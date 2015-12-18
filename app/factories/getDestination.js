app.factory("getDestination", [function(){

	var currentDestination = "";

	return {
		addDestination: function (destination) {
			currentDestination = destination;
			return currentDestination;
		},
		getDestination: function () {
			return currentDestination;
		}
	}
}]);