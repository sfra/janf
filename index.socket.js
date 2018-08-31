const fs = require('fs');
const io = require('socket.io')();

let Server = {};

io.on('connection', function (client) {
    
    fs.watch('./application/resources/css/', (event, file) => {

    io.emit('fs','changed');
    console.log('changed');

});

    

});

io.listen(3000);
