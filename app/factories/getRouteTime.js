app.factory("getRouteTime", [function(){

var factoryRouteTime = "";

return {
	addRouteTime: function(timeDuration) {
		factoryRouteTime = timeDuration;
		console.log("Factory Time", factoryRouteTime);
	},
	getRouteTime: function(){
		return factoryRouteTime;
	}
}

}]);