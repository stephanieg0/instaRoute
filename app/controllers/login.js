app.controller("loginController", ["$scope", "$firebaseArray", "$firebaseAuth", "$location", "$rootScope",
	function ($scope, $firebaseArray, $firebaseAuth, $location, $rootScope) { 
	//the map is hidden.
  $rootScope.loggedin = true;

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
        //displaying the map after loggin in.
        $rootScope.loggedin = false;

        }).catch(function(error){
          console.log("authentication failed:", error);
          }); 		

  };//end of facebookLogin


  $scope.SignUp = function () {
    var userName = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var ref = new Firebase("https://commutealert.firebaseio.com/users");
    console.log("button works");

    ref.createUser({
      "email"   : email,
      "password": password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        var ref = new Firebase("https://commutealert.firebaseio.com/users/" + userData.uid);
        console.log("https://commutealert.firebaseio.com/users/" + userData.uid);
        console.log("Successfully created user account with uid:", userData.uid);
        ref.set({
          "uid": userData.uid,
          "name": userName
        });
        //if the auth is successfull, relocate to the home url.
        $location.url("/commuteAlert/home");
        }
      });
      
  };//end SignUp

}]);//end of controller





