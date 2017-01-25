var ratingDetailsuserBasicInfo = {};
var userMoreInfo = null;
var userId = null;
var tagImages = ["police.png", "robbery.png", "crime.png", "accident.png", "pothole.png", "disaster.png", "school.png"];

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
          userId = userId[0];          
          Auth.setUser(userId);     
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
    formData.getUser(currentUser).then(function(snapshot) {
        $scope.profileDetail = snapshot.val();
      }
    );  
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
                  '<form class="login-form" ng-submit="AddTagToMap(choice)">'+           
                  '<ion-radio ng-model="choice" style="margin-top: 15px;" ng-value="0">Police Check Point</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="1">Robbery Prone Area</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="2">Crime Scene</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="3">Accident</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="4">Big Pot Hole</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="5">Disaster (Flooding/Fire)</ion-radio>'+
                  '<ion-radio ng-model="choice" ng-value="6">School Children</ion-radio>'+
                  '<input type="submit" class="button button-light button-android full" style="Width: 100.08%;margin-left: -1px;" value="Confirm Tag"></form>'+
                  '</section></div></div>'+
                  '</ion-content>'+
                  '</ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  
  $scope.closePopover = function(choice) {
    console.log(map.getCenter());
    var selectedval = choice;
    
    var image = {
      url: './img/' + tagImages[selectedval],
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(40, 40),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(20, 40)
    };
                      
    myLocation = new google.maps.Marker({
        position: new google.maps.LatLng(map.getCenter().lat(), map.getCenter().lng()),
        map: map,
        // draggable: true,
        animation: google.maps.Animation.DROP,
        icon: image,
        title: "My Location"
    });
      
    var tagType = null;
    if (selectedval == 0){
      tagType = "Police Check Point";
    }
    else if (selectedval == 1){
      tagType = "Robbery Prone Area";
    }else if (selectedval == 2){
      tagType = "Crime Scene";
    }else if (selectedval == 3){
      tagType = "Accident";
    }else if (selectedval == 4){
      tagType = "Big Pot Hole";
    }else if (selectedval == 5){
      tagType = "Disaster";
    }else if (selectedval == 6){
      tagType = "School Children";
    }
    
    var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h4 id="firstHeading" class="firstHeading">'+ tagType +'</h4>'+
            '<p>Created: ' + new Date().toLocaleString() + '</p>'+
            '</div>'+
            '</div>';   
            
    var infowindow = new google.maps.InfoWindow({
      content: 'holding..'
    })
    
    google.maps.event.addListener(myLocation, 'click', function () {
      infowindow.setContent(contentString);
      infowindow.open(map, this);
    });
         
    $scope.popover.hide();
  };
  
  $scope.AddTagToMap = function(choice) {
    if (choice != undefined){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirm',
        template: 'Do you want to add the selected tag?',
        cancelText: 'No',
        okText: 'Yes'
      }).then(function(res) {
          if (res) {
              $scope.closePopover(choice);
      
              $ionicPopup.alert({
                title: 'Done!',
                template: 'Tag has been Added Successfully'
              });
          }
      });
    }
    else {
      alert("Please Select a Tag Type.");
    }
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

.controller('RatingCtrl', function($scope, $ionicPopup, formData, Auth) {
  // set the rate and max variables
  $scope.rating = {};
  $scope.rating.rate = 3;
  $scope.rating.max = 5;
  var currentUser = Auth.getUser().userId;

  formData.getUser(currentUser).then(function(snapshot) {
        $scope.isRated = snapshot.val().isRated;
        
        formData.getRatings().then(function(result) {
          var ratingData = result.val();
          $scope.ratings = ratingData;
          if ($scope.isRated){
            
            $scope.excellentCount = 0;
            $scope.goodCount = 0;
            $scope.neutralCount = 0;
            $scope.ntImpovCount = 0;
            $scope.badCount = 0;
            
            var iterator = 0;
            angular.forEach(ratingData, function(value, key) {
              if (value.rating == 5){
                ++$scope.excellentCount;
              }else if (value.rating == 4){
                ++$scope.goodCount;                
              }else if (value.rating == 3){
                ++$scope.neutralCount;                
              }else if (value.rating == 2){
                ++$scope.ntImpovCount;                
              }else if (value.rating == 1){
                ++$scope.badCount;                
              }
              iterator = iterator + 1;
            });
            
            $scope.excellentCount = $scope.excellentCount / iterator * 100;
            $scope.goodCount = $scope.goodCount / iterator * 100;
            $scope.neutralCount = $scope.neutralCount / iterator * 100;
            $scope.ntImpovCount = $scope.ntImpovCount / iterator * 100;
            $scope.badCount = $scope.badCount / iterator * 100;
          }
        });
      }
  );

  $scope.submitRatingInfo = function(ratingInfo) { 
    if (ratingInfo == undefined) {
      alert('Please select your rating.');
    }
    else if (ratingInfo.ratingVal == undefined) {
      alert('Please select your rating.');
    }
    else {
      if (ratingInfo.comment == undefined){
        ratingInfo.comment = "";
      }
      
      formData.saveRating(ratingInfo, currentUser);
      $ionicPopup.alert({
          title: 'Done!',
          template: 'You Successfully Rated'
      });
    }
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





