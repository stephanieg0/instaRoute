var app = angular.module("app", ['ngRoute', 'firebase', 'ngCookies']);

//route provider contains paths to controllers to bind to Dom.
app.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
		.when('/login', {
			templateUrl: "../partials/login.html",
			controller: "loginController"
			})
		.when('/home', {
			templateUrl: "../partials/home.html",
			controller: "apiController"
			})
		.otherwise('/login');

}]);//end of config
