var app = angular.module("app", ['ngRoute', 'firebase']);

//route provider contains paths to controllers to bind to Dom.
app.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
		.when('/commuteAlert/home', {
			templateUrl: "../partials/home.html",
			controller: "apiController"
			});
}]);//end of config