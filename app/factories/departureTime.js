app.factory("departureTime", [function () {

	var setDepartureTime = "";

	return {
		addTime: function (stringValue){
			setDepartureTime = stringValue;
			//console.log("setDepartureTime", setDepartureTime);
			return setDepartureTime;
		},
		getTime: function (){
			//console.log("factory setDepartureTime:", setDepartureTime);
			return setDepartureTime;
		}
	};


}]);//end of factory.