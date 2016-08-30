var binaryServer = require('binaryjs').BinaryServer;
//var drive = require('../local_modules/googleDrive.js');
var fs = require('fs');

var server = binaryServer({port: 9001});

//TODO take meta as opts and file name
//TODO more performance testing. Compare client side compression to server side compression.

server.on('connection', function (client) {
    var fileWriter = null;
    
    client.on('stream', function (stream, meta) {

        stream.on('end', function() {
            console.log("mic readStream has ended.");
        });

        stream.pipe(fs.createWriteStream('test.ogv'));

        // drive.init(function() {
        //     drive.insert({
        //         path: ['audio-test'],
        //         title: 'demo-new.ogg',
        //         body:oe
        //     });
        // });
    });

    // client.on('close', function () {
    //     if (ve != null) {
    //         ve.end();
    //     }
    // });
});
