var constraints = {
    audio: true,
    video: false
};

var recordRTC = null;

navigator.mediaDevices.getUserMedia(constraints)
    .then(initializeRecorder)
    .catch(function() {
        //error handle
    });

var client = new BinaryClient('ws://localhost:9001');

client.on('open', function() {
    // for the sake of this example let's put the stream in the window
    window.Stream = client.createStream();
});





function initializeRecorder(stream) {
    var audioContext = window.AudioContext;
    var context = new audioContext();
    var audioInput = context.createMediaStreamSource(stream);
    var bufferSize = 2048;
    // create a javascript node
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);
    // specify the processing function
    recorder.onaudioprocess = recorderProcess;
    // connect stream to our recorder
    audioInput.connect(recorder);
    // connect our recorder to the client's speakers?
    recorder.connect(context.destination);
}

function recorderProcess(e) {
    var left = e.inputBuffer.getChannelData(0);
    window.Stream.write(convertFloat32ToInt16(left));
}

function convertFloat32ToInt16(buffer) {
    l = buffer.length;
    buf = new Int16Array(l);
    while (l--) {
        buf[l] = Math.min(1, buffer[l])*0x7FFF;
    }
    return buf.buffer;
}