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
        svc.context.close();
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
        var audioContext = window.AudioContext;
        svc.context = new audioContext();
        var audioInput = svc.context.createMediaStreamSource(stream);
        var bufferSize = 1024;
        // create a javascript node
        var recorder = svc.context.createScriptProcessor(bufferSize, 1, 1);
        // specify the processing function
        recorder.onaudioprocess = recorderProcess;
        // connect stream to our recorder
        audioInput.connect(recorder);
        // connect our recorder to the client's speakers?
        //this can't be what is happening
        recorder.connect(svc.context.destination);
        if (callback) { callback() };
    }

    function recorderProcess(e) {
        var left = e.inputBuffer.getChannelData(0);
        svc.writeStream.write(convertFloat32ToInt16(left));
    }

    function convertFloat32ToInt16(buffer) {
        l = buffer.length;
        buf = new Int16Array(l);
        while (l--) {
            buf[l] = Math.min(1, buffer[l])*0x7FFF;
        }
        return buf.buffer;
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