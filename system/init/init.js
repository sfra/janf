var INIT_CONFIG = require(process.env.INIT_CONFIG);
var ROOT_PATH = INIT_CONFIG.config.ROOT_PATH;


if ( typeof(App) == undefined ) {
    App={};
}




var clone = require(ROOT_PATH + "/system/libfile").clone;

/**
 * 
 * @returns {void}
 */
Object.prototype.simpleExtend = function(){

    var args = Array.prototype.slice.call(arguments);


    var max = args.length - 1;

    var getInst = function(o){
        return o;
    }

    if( typeof args[max] === 'boolean' ){

        if( args[max] === true ){
            getInst = clone;
        }

        max -= 1;
    }


    for( var obj = 0;obj < max + 1;obj++ ){

        for( prop in args[obj] ){

            if( args[obj].hasOwnProperty(prop.toString()) ){
                this[prop] = getInst(args[obj][prop]);
            }
        }

    }


}





