( function() {
  "use strict";

  var graphApp = angular.module( "graphApp" );

  graphApp.config( [ "$httpProvider", "adalAuthenticationServiceProvider", "appId", adalConfigurator ] );

  function adalConfigurator( $httpProvider, adalProvider, appId ) {
    var adalConfig = {
      tenant: "common",
      clientId: appId,
      extraQueryParameter: "nux=1",
      endpoints: {
        "https://graph.microsoft.com": "https://graph.microsoft.com",
        "https://<tenant>.sharepoint.com": "https://<tenant>.sharepoint.com"
      },
      cacheLocation: "localStorage" // In IE sessionStorage doesn't work for localhost.
    };
    adalProvider.init( adalConfig, $httpProvider );
  }
} )();