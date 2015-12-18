app.factory("getOrigin", [function(){
//**This factory is for passing the specific origin when departure time is clicked.
	var currentOrigin = "";

	return {
		addOrigin: function (origin) {
			currentOrigin = origin;
			return currentOrigin;
		},
		getOrigin: function () {
			return currentOrigin;
		}
	};

}]);