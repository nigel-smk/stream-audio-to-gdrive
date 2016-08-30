//TODO take values for recording quality and filename
//TODO log user into their drive so the files can be uploaded to their google drive

var app = angular.module("app", ["userMedia"]);

app.factory("streamAudio", ["userMediaService", function(userMediaService){

    //todo onDestroy? stop the stream

    var svc = this;
    //how else to init?
    svc.client = null;
    //audioContext
    svc.context = null;
    svc.micStream = null;
    svc.writeStream = null;
    var meta = {
        filename: svc.filename
    }

    function record(callback) {
        tapMic(function() {
            tapDestination(function() {
                initializeRecorder(svc.micStream, callback);
            });
        });
    }

    function stop() {
        svc.writeStream.end();
        svc.mediaRecorder.stop();
        svc.client.close();
    }

    function tapMic(callback) {
        userMediaService
            .then(function(stream){
                svc.micStream = stream;
                callback();
            });
    }

    function tapDestination(callback) {
        svc.client = new BinaryClient('ws://localhost:9001');

        svc.client.on('open', function() {
            if (!meta.filename) {
                meta.filename = "default.wav"
            }
            svc.writeStream = svc.client.createStream(meta);
            if (callback) { callback() };
        });
    }

    function initializeRecorder(stream, callback) {
        svc.mediaRecorder = new MediaRecorder(stream, { 'type': 'video/ogv; codecs=opus' });
        svc.mediaRecorder.ondataavailable = function(event) {
            svc.writeStream.write(event.data);
        };
        svc.mediaRecorder.start();
        if (callback) { callback() };
    }

    return {
        record: record,
        stop: stop
    }

}]);

app.controller("RecordStop", ["streamAudio", function(streamAudio) {
    var vm = this;

    vm.start = streamAudio.record;
    vm.stop = streamAudio.stop;
}]);