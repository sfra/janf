var ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
var fs = require('fs'), libFile = require('./libfile');
var helper;

Htmlhelper = function(){

    if( !(this instanceof Htmlhelper) ){
        return new Htmlhelper(arguments);
    }
    console.log("in htmlhelper class:");
    console.log(arguments);

    this.fun = arguments[0][0];
    helper = require(ROOT_PATH + "/application/helpers/" + arguments[0][0]);

    var argWithoutFirst = [ ];
    var argNo = 0;

    while( true ){
        if( arguments[0][argNo + 1] == undefined ){
            break;
        }
        argWithoutFirst[argNo] = arguments[0][argNo + 1];
        argNo += 1;
    }


    this.getHelperValue = function(){
        return helper[this.fun].apply(helper[this.fun], argWithoutFirst);
    }
}


exports.Htmlhelper = Htmlhelper;