let ROOT_PATH=require(process.env.INIT_CONFIG).config.ROOT_PATH;
let Controller = require(ROOT_PATH + '/system/Controller');
let libs=require(ROOT_PATH+"/system/libfile");
let socketsingleton=new require(ROOT_PATH+"/system/socketsingleton").Socketsingleton();
/**
 * @class %CONTROLLER%
 * @constructor
 * @inherits Controller.Controller
 */
let %CONTROLLER% = function(){

    Controller.Controller.apply(this, arguments);

/*initial values*/
       

    //begin actions

    this.index = function(){

      

    }



    //end actions


    //execute action
    this[this.act]();

}

%CONTROLLER%.prototype=Controller.Controller.prototype;
exports.%CONTROLLER% = %CONTROLLER%;