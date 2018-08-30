let INIT_CONFIG = require(process.env.INIT_CONFIG);
let ROOT_PATH = INIT_CONFIG.config.ROOT_PATH;


if ( typeof(App) == undefined ) {
    App={};
}




let clone = require(ROOT_PATH + "/system/libfile").clone;

/**
 * 
 * @returns {void}
 */
Object.prototype.simpleExtend = function(){

    let args = Array.prototype.slice.call(arguments);


    let max = args.length - 1;

    let getInst = function(o){
        return o;
    }

    if( typeof args[max] === 'boolean' ){

        if( args[max] === true ){
            getInst = clone;
        }

        max -= 1;
    }


    for( let obj = 0;obj < max + 1;obj++ ){

        for( prop in args[obj] ){

            if( args[obj].hasOwnProperty(prop.toString()) ){
                this[prop] = getInst(args[obj][prop]);
            }
        }

    }


}





