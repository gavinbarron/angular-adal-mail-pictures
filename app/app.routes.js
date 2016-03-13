(function(){
  'use strict';

  var graphApp = angular.module('graphApp');

  // load routes
  graphApp.config(['$routeProvider', routeConfigurator]);

  function routeConfigurator($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.html',
        controller: 'homeController',
        controllerAs: 'vm',
        requireADLogin: true
      });

    $routeProvider.otherwise({redirectTo: '/'});
  }
})();
