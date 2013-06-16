var INIT_CONFIG = require(process.env.INIT_CONFIG);
var ROOT_PATH = INIT_CONFIG.config.ROOT_PATH;


/**
 * @class Model
 * @constructor
 */
Model = function(){
    var args = Array.prototype.slice.call(arguments);
    this.config = require(ROOT_PATH + "/system/libfile").clone(INIT_CONFIG.DBConfig);
    this.config.simpleExtend(args[0]);

    var events = require('events');
    this.emm = new events.EventEmitter();

    this.row = [ ];

}

/**
 * Produces Model
 * @param {object} config configuration object of database connection
 * @param {string} adapter if is not set, takes adapter from config
 * @returns {Model}
 */
ModelFactory = function(config, adapter){

    if( adapter === undefined ){
        (adapter = config.adapter);
    }
    ;

    try{
        var Inst = require(ROOT_PATH + "/system/Model/" + adapter).DB;
        return new Inst(config);
    } catch( e ){
        //  console.log("There is something wrong with "+adapter+" model\n",e);
        return null;
    }
    ;
    return null;
}

exports.Model = Model;
exports.ModelFactory = ModelFactory;