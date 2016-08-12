var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
var drive = require('../googleDrive.js')

var server = binaryServer({port: 9001});

server.on('connection', function (client) {
    var fileWriter = null;

    client.on('stream', function (stream, meta) {
        var writer = new wav.Writer('demo.wav', {
            channels: 1,
            sampleRate: 44100,
            bitDepth: 16
        });
        stream.pipe(writer);
        stream.on('end', function () {
            writer.end();
        });

        drive.init(function() {
           drive.insert({
               title: 'demo.wav',
               body: writer
           });
        });
        
    });

    client.on('close', function () {
        if (fileWriter != null) {
            fileWriter.end();
        }
    });
});
