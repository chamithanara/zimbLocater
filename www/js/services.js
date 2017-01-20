var database = null;
var _user = null;

angular.module('starter.services', [])

.run(function($ionicPlatform,  $ionicAnalytics, ngFB) {
  // initialize the firebase
  var config = {
    apiKey: "AIzaSyCBvS8OUXB1kehV2lqoL5GYCrPP4NuSXzY",
    authDomain: "wherearethepopos.firebaseapp.com",
    databaseURL: "https://wherearethepopos.firebaseio.com",
    storageBucket: "wherearethepopos.appspot.com",
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  database = firebase.database();
})

.service('formData', function($state) {
 return {
   RegsiterForm: function(userBasicInfo, userMoreInfo, user, userId) {
     firebase.auth().createUserWithEmailAndPassword(userBasicInfo.email, userBasicInfo.password)
     .then(function(readCountTxn) {        
        $state.go('app.login');
        
        // save user to the database
        database.ref('users/' + userId).set({
          "email": userBasicInfo.email,          
          "name": userBasicInfo.name,
          "address": userBasicInfo.address,
          "mobileNum": userBasicInfo.telno,
          "isHaveOwnVehicle": userMoreInfo.ownVehicle,
          "vehicleType": userMoreInfo.vehicleType,
          "driveNomally": userMoreInfo.driveNormally,
          "isAlcoholic": userMoreInfo.alcoholic,
          "occupation": userMoreInfo.occupation,
          "isRated": false
        });

     }, function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'weak-password') {
          alert('The password is too weak.');
        } 
        else if (errorCode == 'invalid-email')
        {
          alert('email address is not valid.');
        }
        else if (errorCode == 'email-already-in-use')
        {
          alert('Already exists an account with the given email address.');
        }
        else {  
          alert(errorMessage);
        }
        
        $state.go('home');
     });
   },
   
   LoginForm: function(user) {
     firebase.auth().signInWithEmailAndPassword(user.email, user.password)
     .then(function(readCountTxn) {
        $state.go('app.dash');

     }, function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'wrong-password') {
          alert('Wrong password.');
        }if (errorCode === 'invalid-email') {
          alert('Email address is not valid.');
        }if (errorCode === 'user-disabled') {
          alert('Given email has been disabled.');
        }if (errorCode === 'user-not-found') {
          alert('No user corresponding to the given email.');
        } else {
          alert(errorMessage);
        }

        console.log(error);
      });
   },
   
   getUser:  function(userId) {
     firebase.database().ref('/users/' + userId).once('value')
        .then(function(snapshot) {
          return snapshot.val();
        }
     );
   },

   saveRating: function(ratingDetails, userId) {
      // save rating to the database
      database.ref('ratings/' + userId).set({
        "rating": ratingDetails.ratingVal,          
        "comment": ratingDetails.comment,
      });

      var userRef = database.ref.child("/users").child(userId);

      userRef.once('value', function(snapshot) {
        if (snapshot.val() === null) {
            /* does not exist */
        } else {
            snapshot.ref().update({"isRated": true});
        }
      });
   },
 }
})

.factory('Chats', function() {
  var users = [{
    id: 0,
    name: 'Profile Name',
    desc: 'Travel, surprises, music, dancing, sports, books, last minute plans, open mind, photography, museum, craziness, spontaneity, going out (but also staying in), sharing, simplicity, respect, flip flops (yes, the sandals), down to earth (however fantasy is also very important), people, casual, word, news, work, sense of humor about yourself, awareness.',
    perH: 'XXXX',
    details:'Details',
    face: './img/thumb-m.png',
    addTime: 'Registered Date',
    addCity: 'City',
    addCountry: 'Country'

  }];
  
  return {
    all: function() {
      return users;
    },
    remove: function(chat) {
      users.splice(users.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === parseInt(chatId)) {
          return users[i];
        }
      }
      return null;
    }
  };
});

angular.module('auth.services', [])
.factory('Auth', function () {
//   if (window.localStorage['session']) {
//      _user = JSON.parse(window.localStorage['session']);
//   }

   return {
      setUser: function (userId) {
        _user = { "userId" : userId };

//        var userExists = false;
//        if (window.localStorage['session'] != undefined){
//          angular.forEach(JSON.parse(window.localStorage['session']), function(keyOuter, valueOuter) {
//            angular.forEach(keyOuter, function(keyInner, valueInner) {
//              if (keyInner === email) {
//                userExists = true;
//                // $scope.results.push({serial: key, owner: value[0].Owner});
//              }
//            });
//          });
//        }
//        else {
          window.localStorage['session'] = JSON.stringify(_user);
//        }

//        if (!userExists && window.localStorage['session'] != undefined){
//          ///////// not working - not concatinating the user
//           window.localStorage['session'] = angular.extend(window.localStorage['session'], JSON.stringify(_user));
//        }
      },
      isLoggedIn: function () {
         return window.localStorage['session'] ? true : false;
      },
      getUser: function () {
         return JSON.parse(window.localStorage['session']);
      },
      logout: function () {
         window.localStorage.removeItem("session");
         //window.localStorage.removeItem("list_dependents");
         _user = null;
      }
   }
});