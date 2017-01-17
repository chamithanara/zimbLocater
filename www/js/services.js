var database = null;

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
   RegsiterForm: function(userPersonaldata) {
     firebase.auth().createUserWithEmailAndPassword(userPersonaldata.email, userPersonaldata.password)
     .then(function(readCountTxn) {
        $state.go('app.login');
        $window.localStorage.setItem("isRegistered", true);
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
        $window.localStorage.setItem("isLoggedIn", true);
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
    }
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
   var _user = null;
   if (window.localStorage['session']) {
      _user = JSON.parse(window.localStorage['session']);
   }

   return {
      setUser: function (session) {
        _user = session;
        window.localStorage['session'] = JSON.stringify(_user);
      },
      isLoggedIn: function () {
         return _user ? true : false;
      },
      getUser: function () {
         return _user;
      },
      logout: function () {
         window.localStorage.removeItem("session");
         window.localStorage.removeItem("list_dependents");
         _user = null;
      }
   }
});