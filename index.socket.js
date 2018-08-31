const fs = require('fs');
const io = require('socket.io')();
const events = require('events');


class EmitFsChange extends EventEmmiter {};
const emitter = new EmitFsChange();


io.on('connection', function (client) {
    emitter.on('fsChange',()=>{
            io.emit('fsChange',()=>{});
    });


});

fs.watch('./application', (event, file) => {
    emitter.emit('fsChange');

});




io.listen(3000);