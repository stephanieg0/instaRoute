var app = angular.module("app", ['ngRoute', 'firebase', 'ngCookies']);

//route provider contains paths to controllers to bind to Dom.
app.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
		.when('/instaRoute/login', {
			templateUrl: "../partials/login.html",
			controller: "loginController"
			})
		.when('/instaRoute/home', {
			templateUrl: "../partials/home.html",
			controller: "apiController"
			})
		.otherwise('/instaRoute/login');
}])
	.run(['$http', function ($http) {
		console.log("run module works");
		//in progress

}]);