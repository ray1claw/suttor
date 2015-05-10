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
    // console.log(this.count);
    $localstorage.set('count', this.count);
    smokeEntries.pop();
    console.log(smokeEntries);
    $localstorage.setObject('smokeEntries', smokeEntries);
  };
})

.controller('ChartController', function($scope, $localstorage){

  var cigPrice = 11;

  var chartdates = [];
  this.weekCost = 0;

  chartdates = $localstorage.getObject('smokeEntries');
  console.log(chartdates);

  var today = new Date;

  var data = {
      labels: [today.getDate()-7,today.getDate()-6,today.getDate()-5,today.getDate()-4,today.getDate()-2,today.getDate()-1,today.getDate()],
      datasets: [
        {
          label: "CountChart",
          fillColor: "rgba(220,220,220,0.5)",
          strokeColor: "rgba(220,220,220,0.8)",
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

  for(var i = data['labels'].length -1; i>=0; i--){

    for (var j = chartdates.length - 1; j >= 0; j--) {

      var tempDate = new Date(chartdates[j]['entrytime']);
      var tempgetDate = tempDate.getDate();
      console.log('TempgetDate: '+tempgetDate);

      if(data['labels'][i] == tempgetDate){
        console.log('LabelDate: '+data['labels'][i]);
        data['datasets'][0]['data'][i]++;
        this.weekCost+=cigPrice;
        console.log('CountChart: '+data['datasets'][0]['data']);
      };
    };
  };

  var ctx = document.getElementById("smokeChart").getContext("2d");
  var myNewChart = new Chart(ctx).Line(data, {
    barShowStroke: false,
    bezierCurveTension : 0.2
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
