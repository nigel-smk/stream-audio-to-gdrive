var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
var drive = require('../googleDrive.js');
var fs = require('fs');
var ogg = require('ogg');
var vorbis = require('vorbis');

var server = binaryServer({port: 9001});

server.on('connection', function (client) {
    var fileWriter = null;
    
    var oe = new ogg.Encoder();
    var ve = new vorbis.Encoder({
        channels: 1
    });
    
    client.on('stream', function (stream, meta) {
        // var writer = new wav.Writer({
        //     channels: 1,
        //     sampleRate: 44100,
        //     bitDepth: 16
        // });
        //stream.pipe(writer);
        stream.pipe(ve);
        ve.pipe(oe.stream());

        stream.on('end', function() {
            console.log("mic readStream has ended.");
            //writer.end();
            ve.end();
        });

        drive.init(function() {
            drive.insert({
                path: ['audio-test'],
                title: 'demo-perf.ogg',
                //body: writer
                body:oe
            });
        });
    });

    client.on('close', function () {
        // if (writer != null) {
        //     writer.end();
        // }
        if (ve != null) {
            ve.end();
        }
    });
});
