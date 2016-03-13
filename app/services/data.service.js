(function() {
    'use strict';

    angular.module('graphApp')
        .service('dataService', ['$q', '$http', dataService]);

    /**
     * Custom Angular service.
     */
    function dataService($q, $http) {

        var self = this;
        self.attachments;

        // public signature of the service
        return {
            getData: getData,
            getAttachment: getAttachment
        };

        /** *********************************************************** */

        function getAttachment(emailId, attachmentId) {
            var deferred = $q.defer();
            $http.get(['https://graph.microsoft.com/v1.0/me/messages/', emailId,
                        '/attachments/', attachmentId].join(''))
                .then(function(response) {
                    var file = ['data:', response.data.contentType, ';base64,', response.data.contentBytes].join('');
                    deferred.resolve(file);
                });

            return deferred.promise;
        }

        function getAttachments(email) {
            var defered = $q.defer();
            $http.get(['https://graph.microsoft.com/v1.0/me/messages/', email.id, '/attachments?',
                '$filter=startswith(contentType,\'image\')&', // <- Because this doesn't work
                '$select=contentType,id,name,size'
            ].join('')).then(function(response) {
                _.each(response.data.value, function(item) {
                    if (item.contentType.indexOf('image') === 0) { // <- we need to filter here...
                        self.attachments.push({
                            emailId: email.id,
                            id: item.id,
                            name: item.name,
                            contentType: item.contentType,
                            size: item.size
                        });
                    }
                    defered.resolve();
                })
            });

            return defered.promise;
        }

        function getData(email) {
            var deferred = $q.defer();
            self.attachments = new Array();
            $http.get(['https://graph.microsoft.com/v1.0/me/messages?',
                '$filter=from/emailAddress/address eq \'', email, '\'',
                ' and hasAttachments eq true'
            ].join(''))
                .then(function(response) {
                    var attachPromises = _.map(response.data.value, getAttachments);
                    $q.all(attachPromises).then(function() {
                        deferred.resolve(self.attachments)

                    });
                })

            return deferred.promise;
        }

    }
})();