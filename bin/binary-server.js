var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
var drive = require('../googleDrive.js');
var fs = require('fs');

var server = binaryServer({port: 9001});

server.on('connection', function (client) {
    var fileWriter = null;

    client.on('stream', function (stream, meta) {
        var writer = new wav.Writer({
            channels: 1,
            sampleRate: 44100,
            bitDepth: 16
        });
        stream.pipe(writer);

        stream.on('end', function() {
            console.log("mic readStream has ended.");
            writer.end();
        });

        drive.init(function() {
            drive.insert({
                path: ['audio-test'],
                title: 'demo.wav',
                body: writer
            });
        });

        //todo write a stream from disk to gdrive to eliminate the possibility that it is the live stream.
        //could be that the header says that the file is very large and gdrive is waiting until a file of that size is actually uploaded.
        //lets try setting the file size to zero in the header.

        //
    });

    client.on('close', function () {
        if (writer != null) {
            writer.end();
        }
    });
});
