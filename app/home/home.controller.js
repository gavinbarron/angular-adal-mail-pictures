( function() {
    "use strict";

    angular.module( "graphApp" )
        .controller( "homeController", [ "dataService", homeController ] );

    /**
     * Controller constructor
     */
    function homeController( dataService ) {
        var vm = this;  // jshint ignore:line
        vm.title = "home controller";
        vm.dataObject = {};
        vm.email = "gavin.barron@teamintergen.com";
        vm.loading = false;
        vm.previewImage = null;
        vm.imageName = "";
        vm.rawBytes = null;

        vm.loadData = function() {
            vm.loading = true;
            dataService.getData( vm.email )
                .then( function( response ) {
                    vm.dataObject = response;
                    vm.loading = false;
                } );
        };

        vm.view = function( emailId, id, fileName ) {
            vm.loading = true;
            vm.imageName = fileName;
            dataService.getAttachment( emailId, id ).then( function( result ) {
                var file = [ "data:", result.contentType, ";base64,", result.bytes ].join( "" );
                vm.previewImage = file;
                vm.rawBytes = result.bytes;
                vm.loading = false;
            } );
        };

        vm.upload = function() {
            vm.loading = true;
            dataService.saveFile( vm.imageName, vm.rawBytes ).then( function() {
                vm.loading = false;
            } );
        };
    }
} )();
