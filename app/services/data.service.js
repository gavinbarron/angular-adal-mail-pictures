( function() {
    "use strict";

    angular.module( "graphApp" )
        .service( "dataService", [ "$q", "$http", dataService ] );

    /**
     * Custom Angular service.
     */
    function dataService( $q, $http ) {
        var self = this;// jshint ignore:line
        self.attachments = [];
        self.webUri = "https://<tennant>.sharepoint.com/";
        self.libraryTitle = "Images";

        // The public signature of the service
        return {
            getData: getData,
            getAttachment: getAttachment,
            saveFile: saveFile
        };

        /** *********************************************************** */

        function arrayBufferToBase64( buffer ) {
            var raw = atob( buffer );
            var rawLength = raw.length;
            var array = new Uint8Array( rawLength );

            for ( var i = 0; i < rawLength; i++ )
            {
                array[ i ] = raw.charCodeAt( i );
            }
            return array.buffer;
        }

        function saveFile( fileName, fileBytes ) {
            var defered = $q.defer();
            var addFileEndPoint = [ self.webUri, "/_api/web/lists/getbytitle('", self.libraryTitle,
                "')/rootfolder/files/add(url='",  fileName, "',overwrite=true)" ].join( "" );

            $http.post( addFileEndPoint, arrayBufferToBase64( fileBytes ), {
                transformRequest: angular.identity
            } ).then( function( response ) {
                    console.log( "file uploaded" );
                    defered.resolve();
                } ) ;
            return defered.promise;
        }

        function getAttachment( emailId, attachmentId ) {
            var deferred = $q.defer();
            $http.get( [ "https://graph.microsoft.com/v1.0/me/messages/", emailId,
                        "/attachments/", attachmentId ].join( "" ) )
                .then( function( response ) {
                    deferred.resolve( {
                        contentType: response.data.contentType,
                        bytes: response.data.contentBytes
                    } );
                } );

            return deferred.promise;
        }

        function getAttachments( email ) {
            var defered = $q.defer();
            $http.get( [ "https://graph.microsoft.com/v1.0/me/messages/", email.id, "/attachments?",
                "$filter=startswith(contentType,\'image\')&", // <- Because this doesn't work
                "$select=contentType,id,name,size"
            ].join( "" ) ).then( function( response ) {
                _.each( response.data.value, function( item ) {
                    if ( item.contentType.indexOf( "image" ) === 0 ) { // <- we need to filter here.
                        self.attachments.push({
                            emailId: email.id,
                            id: item.id,
                            name: item.name,
                            contentType: item.contentType,
                            size: item.size
                        } );
                    }
                    defered.resolve();
                } );
            } );

            return defered.promise;
        }

        function getData( email ) {
            var deferred = $q.defer();
            self.attachments = [];
            $http.get( [ "https://graph.microsoft.com/v1.0/me/messages?",
                "$filter=from/emailAddress/address eq '", email, "'",
                " and hasAttachments eq true"
            ].join( "" ) )
                .then( function( response ) {
                    var attachPromises = _.map( response.data.value, getAttachments );
                    $q.all( attachPromises ).then( function() {
                        deferred.resolve( self.attachments );

                    } );
                } );

            return deferred.promise;
        }

    }
} )();
