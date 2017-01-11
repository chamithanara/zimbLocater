angular.module('starter.controllers', ['starter.services', 'ngOpenFB','ionic'])

.controller("LoginCtrl", function($scope, $state, formData) {
 
  $scope.logoSrc = '/img/mob-logo.png';
  $scope.bgSrc = '/img/mob-background.png';
  $scope.descTxt = "Find the service people";
  $scope.loginTxt = "Login";
  $scope.nextTxt = "Next";
  $scope.registerTxt = "Register";

  $scope.user = {};

  $scope.submitFormLogin = function(user) {
   if (user.username) {
     console.log("Submitting Form", user);
     formData.updateForm(user);
     console.log("Retrieving form from service", formData.getForm());
     $state.go('app.dash');
   } else {
     alert("Please fill out some information for the user");
   }
 };
 
 $scope.submitRegisterBasicForm = function(user) {
   if (user.name) {
     console.log("Submitting Form", user);
     formData.updateForm(user);
     console.log("Retrieving form from service", formData.getForm());
     $state.go('registerMoreInfo');
   } else {
     alert("Please fill out some information for the user");
   }
 };

 $scope.submitRegisterMoreInfoMore = function(user) {
   if (user.name) {
     console.log("Submitting Form", user);
     formData.updateForm(user);
     console.log("Retrieving form from service", formData.getForm());
     $state.go('app.login');
   } else {
     alert("Please fill out some information for the user");
   }
 };
})

/* ---- menu controller -- */
.controller('NavController', function($scope, $ionicSideMenuDelegate) {
    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };
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

/* ---- dashboard  -- */
.controller('DashCtrl', function($scope, $stateParams, $ionicPopup, ngFB, $state, $ionicModal, $timeout, $state, $ionicSideMenuDelegate, formData, $ionicPopover) {
  $scope.ContinueTxt = "Continue";
  console.log("loading...Dashboard")
  $scope.user = formData.getForm();

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
  
  var template =  '<ion-popover-view style="width:98%; margin-left: -6px !important;">'+
                  '<ion-header-bar style="width:100%; ">'+
                    '<h1 class="title" style="text-align:center;">Please Select Your Tag Type</h1>'+
                  '</ion-header-bar>'+
                  '<ion-content scroll="false" style="width:100%; ">'+
                    '<ion-radio ng-model="choice" style="margin-top: 42px;" ng-value="1">Police Check Point</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="2">Robbery Prone Area</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="3">Crime Scene</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="4">Accident</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="5">Big Pot Hole</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="6">Disaster (Flooding/Fire)</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="7">School Children</ion-radio>'+
                  '<button class="button button-light button-android full" ng-click="AddTagToMap()" style="Width:100%">Confirm Tag</button>'+
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

.controller('RatingCtrl', function($scope, $ionicPopup) {
  // set the rate and max variables
  $scope.rating = {};
  $scope.rating.rate = 3;
  $scope.rating.max = 5;

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
/* ---- List Details controller -- */

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get(0);
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
 $scope.user = formData.getForm();
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





