var appVersion = "0.0.0";

angular.module('starter', ['ionic', 'ionic.rating', 'starter.services', 'auth.services', 'ionic.service.core', 'ionic.service.analytics','ionic.service.push', 'starter.controllers','ngCordova', 'ngOpenFB'])

.run(function($ionicPlatform, $ionicAnalytics, ngFB, Auth, $state, $rootScope) {
  ngFB.init({appId: '970200256375080'});

  $ionicPlatform.ready(function() {
    $ionicAnalytics.register();

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });  
})

.config(function($stateProvider, $urlRouterProvider, $ionicAppProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom'); // other values: top
  $ionicConfigProvider.tabs.style("standard"); 

  $ionicAppProvider.identify({
    // The App ID for the server
    app_id: '38d3dd54',
    // The API key all services will use for this app
    api_key: '8989d127b3c50dec67aff1686297fe5c03caf1601c4e2346',
    dev_push: true,
    // The GCM project number
   gcm_id: 'infinite-cache-92312'
  });
  
  $stateProvider

  .state('app', {
    url: '/home',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: "NavController"
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: "TabCtrl"
  })

  .state('app.dash', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('app.list', {
      url: '/list',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    
   .state('app.rating', {
      url: '/rating',
      views: {
        'menuContent': {
          templateUrl: 'templates/Ratings.html',
          controller: 'RatingCtrl'
        }
      }
    })

  .state('app.list-detail', {
      url: '/ProfileDetail',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileDetailCtrl'
        }
      }
  })
    
  .state('app.aboutus', {
      url: '/aboutus',
      views: {
        'menuContent': {
          templateUrl: 'templates/aboutus.html',
          controller: 'AboutusCtrl'
        }
      }
  })
    
  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'AccountCtrl'
      }
    }
  })
  
  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/landing.html',
        controller: 'LoginCtrl'
      }
    }
  });
  
  $stateProvider
      .state('home', {
          url: '/',
          controller: 'LoginCtrl',
          templateUrl: 'templates/Register.html'
  });

  $stateProvider
      .state('registerMoreInfo', {
          url: '/',
          controller: 'LoginCtrl',
          templateUrl: 'templates/registerMoreInfo.html'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});