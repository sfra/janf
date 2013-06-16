var ROOT_PATH=require(process.env.INIT_CONFIG).config.ROOT_PATH;
var Controller = require(ROOT_PATH + '/system/Controller');
var libs=require(ROOT_PATH+"/system/libfile");
var socketsingleton=new require(ROOT_PATH+"/system/socketsingleton").Socketsingleton();
/**
 * @class %CONTROLLER%
 * @constructor
 * @inherits Controller.Controller
 */
var %CONTROLLER% = function(){

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