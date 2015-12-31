app.factory("getRouteSummary", [function(){

var routeSummary = "";

return {
	addRouteSummary: function(routeSummaryDirections) {
		routeSummary = routeSummaryDirections;
		console.log("Factory Summary", routeSummary);
	},
	getRouteSummary: function() {
		return routeSummary;
	}
}
}]);