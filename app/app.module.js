(function(){
  'use strict';

  // create
  var graphApp = angular.module('graphApp', [
    'ngRoute',
    'ngSanitize',
    'AdalAngular',
    'ngMaterial'
  ]);

  // configure
  graphApp.config(['$logProvider', function($logProvider){
    // set debug logging to on
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }
  }]);

})();
