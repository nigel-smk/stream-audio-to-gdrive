var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');

var server = binaryServer({port: 9001});

server.on('connection', function (client) {
    var fileWriter = null;

    client.on('stream', function (stream, meta) {
        var fileWriter = new wav.FileWriter('demo.wav', {
            channels: 1,
            sampleRate: 48000,
            bitDepth: 16
        });
        stream.pipe(fileWriter);
        stream.on('end', function () {
            fileWriter.end();
        });
    });

    client.on('close', function () {
        if (fileWriter != null) {
            fileWriter.end();
        }
    });
});
