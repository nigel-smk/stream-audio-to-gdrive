var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
var drive = require('../googleDrive.js');
var fs = require('fs');
var ogg = require('ogg');
var vorbis = require('vorbis');

var server = binaryServer({port: 9001});

//TODO take meta as opts and file name
//TODO more performance testing. Compare client side compression to server side compression.

server.on('connection', function (client) {
    var fileWriter = null;
    
    var oe = new ogg.Encoder();
    var ve = new vorbis.Encoder({
        channels: 1
    });
    
    client.on('stream', function (stream, meta) {
        stream.pipe(ve);
        ve.pipe(oe.stream());

        stream.on('end', function() {
            console.log("mic readStream has ended.");
            ve.end();
        });

        drive.init(function() {
            drive.insert({
                path: ['audio-test'],
                title: 'demo-perf.ogg',
                body:oe
            });
        });
    });

    client.on('close', function () {
        if (ve != null) {
            ve.end();
        }
    });
});
