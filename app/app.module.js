( function() {
  "use strict";

  // Create
  var graphApp = angular.module( "graphApp", [
    "ngRoute",
    "ngSanitize",
    "AdalAngular",
    "officeuifabric.core",
    "officeuifabric.components"
  ] );

  // Configure
  graphApp.config( [ "$logProvider", function( $logProvider ){
    // Set debug logging to on
    if ( $logProvider.debugEnabled ) {
      $logProvider.debugEnabled( true );
    }
  } ] );

} )();
