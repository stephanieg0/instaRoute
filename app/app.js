var app = angular.module("app", ['ngRoute', 'firebase', 'ngCookies']);

//route provider contains paths to controllers to bind to Dom.
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
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
		$locationProvider.html5Mode(true);
}]);
