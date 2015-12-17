app.factory("getUid", [function () {

  var userData = '';
 
  return {
    //getting user data after log in from login.js
    addUid: function(authData) {
      userData = authData;
      return userData;
    },
    getUid: function() {
      console.log("factory userId :", userData);
      return userData;
    }
  };

}]);//end of factory