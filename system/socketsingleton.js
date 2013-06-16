
var io = require('socket.io');
Socketsingleton = function(){
    var instance;


    if( instance == undefined ){
        instance = io.listen(4000);
    }

    Socketsingleton.getInstance = function(){
        return instance;
    };

}


exports.Socketsingleton = Socketsingleton;