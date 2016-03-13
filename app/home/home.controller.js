(function() {
    'use strict';

    angular.module('graphApp')
        .controller('homeController', ['dataService', homeController]);

    /**
     * Controller constructor
     */
    function homeController(dataService) {
        var vm = this;  // jshint ignore:line
        vm.title = 'home controller';
        vm.dataObject = {};
        vm.email = '';
        vm.loading;
        vm.previewImage;
        vm.loadData = function() {
            vm.loading = true;
            dataService.getData(vm.email)
                .then(function(response) {
                    vm.dataObject = response;
                    vm.loading = false;
                });
        }

        vm.view = function(emailId, id) {
            vm.loading = true;
            dataService.getAttachment(emailId, id).then(function(result) { 
                vm.previewImage = result;
                vm.loading = false;
            });
        }

    }

})();
