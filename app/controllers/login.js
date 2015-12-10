app.controller("loginController", ["$scope", "$firebaseArray", "$firebaseAuth", "$location",
	function ($scope, $firebaseArray, $firebaseAuth, $location) { 
		


	$scope.facebookLogin = function() {
		//firebase reference to app url.
		var ref = new Firebase("https://commutealert.firebaseio.com/users");
		//auth reference to firebaseAuth.
		var auth = $firebaseAuth(ref);	

		auth.$authWithOAuthPopup("facebook").then(function (authData){
  			console.log("logged in as:", authData.uid);
        	//setting data inside current user.
        	ref.child(authData.uid).set(authData);
        	//if the auth is successfull, relocate to the home url.
  			$location.url("/commuteAlert/home");

  			}).catch(function(error){
  				console.log("authentication failed:", error);
  				});
  		

  		};//end of facebookLogin





}]);//end of controller





