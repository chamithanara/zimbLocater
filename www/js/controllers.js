var ratingDetailsuserBasicInfo = {};
var userMoreInfo = null;
var userId = null;

angular.module('starter.controllers', ['starter.services','auth.services', 'ngOpenFB','ionic'])

.controller("LoginCtrl", function($scope, $state, formData, $cordovaFile, Auth) {
   if (Auth.isLoggedIn())
   {
      $state.go('app.dash');     
   }
   
   /////////////// Development 
   // $state.go('app.dash');
   ///////////////////////////
   
   $scope.logoSrc = '/img/mob-logo.png';
   $scope.bgSrc = '/img/mob-background.png';
   $scope.descTxt = "Find the service people";
   $scope.loginTxt = "Login";
   $scope.nextTxt = "Next";
   $scope.registerTxt = "Finish";
   
   $scope.redirectToLogin = function () {
     $state.go('app.login');
   };
   
   $scope.redirectToRegister = function () {
     $state.go('home');
   };
   
   $scope.user = {};
   $scope.doRefresh = function(refresher) {
       setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
     }, 2000);
   };
  
   $scope.submitFormLogin = function(user) {
     if (user.email == undefined || user.password == undefined )
       {
          alert('Please enter email/password');
       }
       else
       {
          formData.LoginForm(user);  
          userId = user.email.split("@");             
          Auth.setUser(userId[0]);     
       }
   };
   
   $scope.submitRegisterBasicForm = function(user) {
       if (user.email == undefined || user.password == undefined )
       {
          alert('Please enter email/password.');
       }
       else if (user.password != user.re_password)
       {
          alert('Passwords do not match.');
       }
       else if (user.name == undefined || 
                user.address == undefined || 
                user.telno == undefined)
       {
          alert('Please fill out all the fields.');
       }
       else
       {
          userBasicInfo = user;
          $state.go('registerMoreInfo');         
       }
   };
  
   $scope.submitRegisterMoreInfoMore = function(user) { 
       if (user.ownVehicle == undefined || 
           user.vehicleType == undefined ||
           user.driveNormally == undefined ||
           user.alcoholic == undefined ||
           user.occupation == undefined )
       {
          alert('Please fill out all the fields.');
       }
       else 
       {
          userMoreInfo = user;
          userId = userBasicInfo.email.split("@");    
          formData.RegsiterForm(userBasicInfo, userMoreInfo, user, userId[0]);
       }    
   };
   
//   function IDGenerator() 
//   {	 
//		 this.length = 8;
//		 this.timestamp = +new Date;
//		 
//		 var _getRandomInt = function( min, max ) 
//     {
//			 return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
//		 }
//		 
//		 var ts = this.timestamp.toString();
//		 var parts = ts.split( "" ).reverse();
//		 var id = "";
//		 
//		 for( var i = 0; i < this.length; ++i ) 
//     {
//			 var index = _getRandomInt( 0, parts.length - 1 );
//			 id += parts[index];	 
//		 }
//		 
//		 return id;		 
//	 }   
  })
  
  /* ---- menu controller -- */
  .controller('NavController', function($scope, $ionicSideMenuDelegate, $state, Auth) {
      $scope.toggleLeft = function() {
        toggleLeftFunc();
      };
      
      $scope.logoutUser = function() {
        Auth.logout();  
        $state.go('app.login');
        toggleLeftFunc();
      }
      
      function toggleLeftFunc(){
        $ionicSideMenuDelegate.toggleLeft();
      }
  })
  
  /* ---- tabs controller -- */
  .controller('TabCtrl', function($scope,  $state){
  
    $scope.gotoHome = function() {
       console.log('logout');
       $state.go('home', {url: 'templates/landing.html'})
    }
  
    $scope.gotoDash = function() {
      console.log('tab > Dash');
    }
  
    $scope.gotoList = function() {
      console.log('tab > List');
       
    }
  
    $scope.gotoSettings = function() {
      console.log('tab > Settings');
       
    }
})

/* ---- Profile Details  -- */
.controller('ProfileDetailCtrl', function($scope, $stateParams, Chats, Auth, formData) {
  if (Auth.getUser() != undefined)
  {
    var currentUser = Auth.getUser().userId;  
    $scope.profileDetail = formData.getUser(currentUser);  
    var s = currentUser;
  }
})

/* ---- dashboard  -- */
.controller('DashCtrl', function($scope, $stateParams, $ionicPopup, ngFB, $state, $ionicModal, $timeout, $state, $ionicSideMenuDelegate, formData, $ionicPopover, Auth) {
  $scope.ContinueTxt = "Continue";
  console.log("loading...Dashboard")
  
  var user = firebase.auth().currentUser;
  
  var latitude = null;
  var longitude = null;
  
  var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

  var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeControl: true,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER
    },
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
    },
    scaleControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  navigator.geolocation.getCurrentPosition(function(pos) {
      map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      myLocation = new google.maps.Marker({
          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          map: map,
          // draggable: true,
          animation: google.maps.Animation.DROP,
          title: "My Location"
      });
      // myLocation.addListener('click', toggleBounce);
      latitude = pos.coords.latitude;
      longitude = pos.coords.longitude;
  });
    
//    google.maps.event.addListener(map, 'dragend', function(event) {
//      document.getElementById("lat").value = event.latLng.lat();
//      document.getElementById("long").value = event.latLng.lng();
//    });
    
//  function toggleBounce() {
//      if (myLocation.getAnimation() !== null) {
//        myLocation.setAnimation(null);
//      } else {
//        myLocation.setAnimation(google.maps.Animation.BOUNCE);
//      }
//    }
    
  $scope.map = map;

//  var infoWnd = new google.maps.InfoWindow({
//    content :  map.getCenter().toUrlValue(),
//    position : map.getCenter(),
//    disableAutoPan: true
//  });
//  infoWnd.open(map);
//
//  //Retrive the center location
//  google.maps.event.addListener(map, "center_changed", function() {
//    infoWnd.setContent(map.getCenter().toUrlValue());
//    infoWnd.setPosition(map.getCenter());
//    infoWnd.open(map);
//  });

// Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/menu.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  
  $scope.AddTagToMap = function() {
    
    myLocation = new google.maps.Marker({
          position: new google.maps.LatLng(latitude, longitude),
          map: map,
          // draggable: true,
          animation: google.maps.Animation.DROP,
          title: "My Location"
      });
  };
  
  $scope.reCenter = function() {
    var center = new google.maps.LatLng(latitude, longitude);
    map.panTo(center);
  };

  $scope.fbLogin = function () {
    ngFB.login({scope: 'public_profile, email, user_friends'}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                $scope.closeLogin();
            } else {
                alert('Facebook login failed');
            }
        });
  };
  
  var template =  '<ion-popover-view style="width: 97%;margin-left: -0.5%;background-color: black;">'+
                  '<ion-content padding="true" class="scroll-content" style="width:100%;" >'+
                    '<div class="wrapper row2">'+
                     ' <div>'+
                          '<section id="about-intro" class="clear">'+
                          '<h3 class="title" style="text-align:center;margin-top: 10px;color:white">Please Select Your Tag Type</h3>'+
                  '<ion-radio ng-model="choice" style="margin-top: 15px;" ng-value="1">Police Check Point</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="2">Robbery Prone Area</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="3">Crime Scene</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="4">Accident</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="5">Big Pot Hole</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="6">Disaster (Flooding/Fire)</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="7">School Children</ion-radio>'+
                  '<button class="button button-light button-android full" ng-click="AddTagToMap()" style="Width:100.05%">Confirm Tag</button>'+
                  '</section></div></div>'+
                  '</ion-content>'+
                  '</ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
    $scope.choice = '1';
  };
  $scope.closePopover = function() {
    console.log(map.getCenter());
    
    myLocation = new google.maps.Marker({
          position: new google.maps.LatLng(map.getCenter().lat(), map.getCenter().lng()),
          map: map,
          // draggable: true,
          animation: google.maps.Animation.DROP,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 5
          },
          title: "My Location"
      });
      
    $scope.popover.hide();
  };
  
  $scope.AddTagToMap = function() {
    $scope.closePopover();
    
    $ionicPopup.alert({
      title: 'Done!',
      template: 'Tag has been Added Successfully'
    });
  }
  
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hidden popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
    
})

/* ---- List  -- */
.controller('ChatsCtrl', function($scope, Chats) {
  
  console.log("loading...list")
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('RatingCtrl', function($scope, $ionicPopup, formData) {
  // set the rate and max variables
  $scope.rating = {};
  $scope.rating.rate = 3;
  $scope.rating.max = 5;

  $scope.isRated = false;

  $scope.isRated = formData.getUser(userId).isRated;

  $scope.submitRatingInfo = function(ratingInfo) { 
    if (ratingInfo.ratingVal == undefined) {
      alert('Please select your rating.');
    }
    else {
      if (ratingInfo.comment == undefined){
        ratingInfo.comment = "";
      }
      
      formData.saveRating(ratingInfo, userId);
    }
  }

  $scope.AddRating = function() {
    $ionicPopup.alert({
        title: 'Done!',
        template: 'You Successfully Rated'
    });
  }
})

.controller('AboutusCtrl', function($scope) {
 
})

/* ------ */
/* ---- landing page controller -- */
.controller('landingCtrl', function($scope, $stateParams, $state) {

// Update app code with new release from Ionic Deploy
  $scope.doUpdate = function() {
    deploy.update().then(function(res) {
      console.log('Ionic Deploy: Update Success! ', res);
    }, function(err) {
      console.log('Ionic Deploy: Update error! ', err);
    }, function(prog) {
      console.log('Ionic Deploy: Progress... ', prog);
    });
  };

  // Check Ionic Deploy for new code
  $scope.checkForUpdates = function() {
    console.log('Ionic Deploy: Checking for updates');
    deploy.check().then(function(hasUpdate) {
      console.log('Ionic Deploy: Update available: ' + hasUpdate);
      $scope.hasUpdate = hasUpdate;
    }, function(err) {
      console.error('Ionic Deploy: Unable to check for updates', err);
    });
  }
  //var deploy = new Ionic.Deploy();

  $scope.gotoState = function() {
    console.log("login")
    //$state.go('tab.chats');
    $state.go('app.settings', {url: 'templates/settings.html'})
    };
  })


/* ---- Settings  -- */
.controller('AccountCtrl', function($scope, $ionicSideMenuDelegate, formData) {

 console.log("loading....settings")
   //$state.go('tab.chats');
   //$state.go('tab.dash', {url: 'templates/tab-dash.html'})
  
  /*ngFB.api({
        path: '/me',
        params: {fields: 'id,name'}
    }).then(
        function (user) {
            $scope.user = user;
        },
        function (error) {
            alert('Facebook error: ' + error.error_description);
        });
  */

  $scope.settings = {
    enableFriends: true
  };
});





