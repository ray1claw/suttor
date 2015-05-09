// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('suttor', ['ionic'])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.controller('CounterController', function($scope, $localstorage){
  var currentDate = new Date();
  var lastDate = new Date($localstorage.get('lastDate') || null);
  var smokeEntries = [];

  smokeEntries = $localstorage.getObject('smokeEntries');
  this.count = Number($localstorage.get('count') || '0');
  // console.log(this.count);

  if (lastDate != null) {
    // if ((currentDate.getTime() - lastDate.getTime())/(1000 * 3600 * 24) >= 1) {
    if (lastDate.getFullYear() <= currentDate.getFullYear()) {
      if (lastDate.getMonth() <= currentDate.getMonth()) {
        if (lastDate.getDate() < currentDate.getDate()) {
          this.count = 0;
        };
      };
    };
  };

  $localstorage.set('lastDate', currentDate);
  $localstorage.set('count', this.count);

  this.addCount = function() {
    this.count++;
    // console.log(this.count);
    $localstorage.set('count', this.count);
    var time = new Date();
    smokeEntries.push({
      'time': time
    });
    console.log(smokeEntries);
    $localstorage.setObject('smokeEntries', smokeEntries);
  };

  this.subtractCount = function() {
    this.count--;
    if (this.count < 0) {
      this.count = 0;
    };
    // console.log(this.count);
    $localstorage.set('count', this.count);
    smokeEntries.pop();
    console.log(smokeEntries);
    $localstorage.setObject('smokeEntries', smokeEntries);
  };
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
