// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('suttor', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'templates/_home.html'
  })
  .state('stats', {
    url: '/stats',
    templateUrl: 'templates/_stats.html'
  })
})

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
    getObject: function(key, defaultValue) {
      return JSON.parse($window.localStorage[key] || defaultValue);
    }
  }
}])

.controller('CounterController', function($scope, $localstorage){
  var currentDate = moment();
  var lastDate = moment($localstorage.getObject('lastDate', null));
  console.log(currentDate);
  console.log(lastDate);

  var smokeEntries = $localstorage.getObject('smokeEntries', '[]');

  this.count = Number($localstorage.get('count') || '0');
  // console.log(this.count);

  if (lastDate != null) {
    if (lastDate.isBefore(currentDate, 'day')) {
      this.count = 0;
    };
    // if ((currentDate.getTime() - lastDate.getTime())/(1000 * 3600 * 24) >= 1) {
    // if (lastDate.getFullYear() <= currentDate.getFullYear()) {
    //   if (lastDate.getMonth() <= currentDate.getMonth()) {
    //     if (lastDate.getDate() < currentDate.getDate()) {
    //       this.count = 0;
    //     };
    //   };
    // };

  };

  $localstorage.setObject('lastDate', currentDate);
  $localstorage.set('count', this.count);

  this.addCount = function() {
    this.count++;
    $localstorage.set('count', this.count);
    var time = moment();
    smokeEntries.push({
      'entrytime': time
    });
    console.log(smokeEntries);
    $localstorage.setObject('smokeEntries', smokeEntries);
  };

  this.subtractCount = function() {
    this.count--;
    if (this.count < 0) {
      this.count = 0;
    };
    $localstorage.set('count', this.count);
    smokeEntries.pop();
    console.log(smokeEntries);
    $localstorage.setObject('smokeEntries', smokeEntries);
  };
})

.controller('ChartController', function($scope, $localstorage){
  this.weekCost = 0;
  this.cigPrice = 12;

  var smokeEntries = $localstorage.getObject('smokeEntries');

  var today = moment();

  var data = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      datasets: [
        {
          label: "CountChart",
          fillColor: "rgba(255, 103, 13, 0.5)",
          strokeColor: "rgba(255, 103, 13, 0.8)",
          highlightFill: "rgba(220,220,220,0.75)",
          highlightStroke: "rgba(220,220,220,1)",
          data: [0,0,0,0,0,0,0]
        }

        // {
        //     label: "PriceChart",
        //     fillColor: "rgba(151,187,205,0.5)",
        //     strokeColor: "rgba(151,187,205,0.8)",
        //     highlightFill: "rgba(151,187,205,0.75)",
        //     highlightStroke: "rgba(151,187,205,1)",
        //     data: [0,0,0,0,0,0,0]
        // }
      ]
  };

  for(var i = today; i.isAfter(today.startOf('week')) || i.isSame(today.startOf('week')); i.subtract(1, 'days')){

    for (var j = smokeEntries.length - 1; j >= 0; j--) {

      var tempDate = moment(smokeEntries[j]['entrytime']);
      // var tempgetDate = tempDate.date();
      console.log(i.day());
      console.log(tempDate);
      console.log(i.isSame(tempDate, 'day'));
      if(i.isSame(tempDate, 'date')) {
        // console.log('LabelDate: '+data['labels'][i.day()-1]);
        data['datasets'][0]['data'][i.day()-1]++;
        this.weekCost += this.cigPrice;
        // console.log('CountChart: '+data['datasets'][0]['data']);
      };

      /*break inner loop for before start of week*/
    };
  };

  var ctx = document.getElementById("smokeChart").getContext("2d");
  var myNewChart = new Chart(ctx).Line(data, {
    barShowStroke: false,
    bezierCurveTension : 0.2,
    scaleGridLineColor : "rgba(0,0,0,0)"
  });
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
