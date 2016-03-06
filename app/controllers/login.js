app.controller("loginController", ["$scope", "$firebaseArray", "$firebaseAuth", "$location", "$rootScope", "getUid",
	function ($scope, $firebaseArray, $firebaseAuth, $location, $rootScope, idFactory) {

	//the map is hidden.
  $rootScope.loggedin = true;
  //error messages to display in the page.
  $scope.SignUpErrorMessage = "";
  $scope.LogInErrorMessage = "";

  //facebook log in/sign up.
	$scope.facebookLogin = function() {
    //firebase reference to app url.
    var ref = new Firebase("https://instaroute.firebaseio.com/users");
    //auth reference to firebaseAuth.
    var auth = $firebaseAuth(ref);

    auth.$authWithOAuthPopup("facebook").then(function (authData){
        //console.log("logged in as:", authData.uid);
        //setting data inside current user.
        ref.child(authData.uid).set(authData);
        //if the auth is successfull, relocate to the home url.
        $location.url("/home");
        //displaying the map after loggin in.
        $rootScope.loggedin = false;
        //sending current user data to factory to use later.
        idFactory.addUid(authData);

        }).catch(function(error){
          console.log("authentication failed:", error);
          });

  };//end of facebookLogin

  //Sign up for first time user.
  $scope.SignUp = function() {
    //user inputs.
    var userName = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var ref = new Firebase("https://instaroute.firebaseio.com/users");
    //auth reference to firebaseAuth. For Home page to recognize the user id.
    var auth = $firebaseAuth(ref);
    //console.log("auth", auth);
    ref.createUser({
      "email"   : email,
      "password": password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
        $scope.SignUpErrorMessage = "User account already exists."
        $scope.LogInErrorMessage = "";
      } else {
        $scope.SignUpErrorMessage = "";
        $scope.LogInErrorMessage = "";
        //if the auth is successfull, relocate to the home url.
        $location.url("/home");
        //display map.
        $rootScope.loggedin = false;

        var ref = new Firebase("https://instaroute.firebaseio.com/users/" + userData.uid);
        //console.log("Successfully created user account with uid:", userData.uid);
        //set user and keys in firebase
        ref.set({
          "uid": userData.uid,
          "facebook": {
            "displayName": userName}
        });
        //sending current user data to factory to use later.
        idFactory.addUid(userData);
        }
        $scope.$apply();
      });
  };//end SignUp

  //Sign in for existing user.
  $scope.Signin = function() {
    $scope.SignUpErrorMessage = "";
    //user inputs.
    var userName = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    //firebase correct path.
    var ref = new Firebase("https://instaroute.firebaseio.com/users");
    //auth reference to firebaseAuth. For Home page to recognize the user id.
    var auth = $firebaseAuth(ref);
    //Authentication with password.
    ref.authWithPassword({
      "email"   : email,
      "password": password
    }, function(error, authData) {
      if (error) {
        //error message displayed on the page.
        $scope.LogInErrorMessage = "Please create an account";
        console.log("Login Failed!", error);
      } else {
        //if the auth is successfull, relocate to the home url.
        $location.url("/home");
        //display map.
        $rootScope.loggedin = false;
        //clear error message.
        $scope.LogInErrorMessage = "";
        $scope.SignUpErrorMessage = "";
        //console.log("Authenticated successfully with payload:", authData);
        //sending current user data to factory to use later.
        idFactory.addUid(authData);
      }
        $scope.$apply();
      });
  };

}]);//end of controller





