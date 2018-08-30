
let io = require('socket.io');
/**
 * @class sigleton class storing singleton
 * @constructor
 * @returns {Socketsingleton}
 */

Socketsingleton = function(){
    let instance;


    if( instance == undefined ){
        instance = io.listen(4000);
    }

    Socketsingleton.getInstance = function(){
        return instance;
    };

}


exports.Socketsingleton = Socketsingleton;