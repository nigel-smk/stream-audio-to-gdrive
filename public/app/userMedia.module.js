angular.module('userMedia', [])
    .constant('UM_Event', {
        GOTSTREAM: 'gotStream'
    })
    .factory('userMediaService', ['$rootScope', 'UM_Event', '$q', function($rootScope, UM_Event, $q){
        var _stream = null;
        var _err = null;

        var mediaConstraint = { video: true, audio: true };
        console.log('userMediaSvc | started');
        navigator.mediaDevices.getUserMedia(mediaConstraint)
            .then(onSuccess)
            .catch(onFailure);

        function onSuccess(stream){
            console.log('getUserMedia | Got stream')
            //$rootScope.$emit(UM_Event.GOTSTREAM, stream, _err);
            _stream = stream;
        }
        function onFailure(err){
            console.error('getUserMedia | Stream failed')
            _err = err;
        }

        return $q(function(resolve, reject){
            if(_stream){
                resolve(_stream);
            //} else if (_err){
            //    reject(_err);
            } else {
                navigator.mediaDevices.getUserMedia(mediaConstraint)
                    .then(function(stream) {
                        _stream = stream;
                        resolve(stream);
                    })
                    .catch(function(err) {
                        _err = err;
                        reject(err);
                    });
            }
        });
    }]);