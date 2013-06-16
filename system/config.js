var ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
var CONFIG = require(process.env.INIT_CONFIG).config;
var http = require('http'), qs = require('querystring'),
        libFile = require(ROOT_PATH + '/system/libfile');


/**
 * @class View
 * @constructor
 * @param {String} config file name
 */
Config = function(file){


    this.properties = { };


    if( !file ){
        return this;                               //code
    }

    var confArray = new Array();


    var data = libFile.toString(file);


    /* remove comments*/
    var data = data.replace(/(.*)\;.*\n/g, function(match, g1, offset, s){

        var rest = "";
        if( match.charAt(0) != ';' ){
            var rest = "\n";
        }
        return g1 + rest;
    }
    );

    /* insert content of imported files*/
    var data = data.replace(/@IMPORT\(\'([A-Za-z\/\.]+)\'\)/g, function(match, gr1, index, original){

        return trimString(libFile.toString(ROOT_PATH + "/application/views/config/" + gr1));
        //return group1;
    });






    confArray = data.split("\n");

    var confOneLinePerItem = new Array();
    var itemUpToEq;

    for( var k = 0, j = -1;k < confArray.length;k++ ){

        itemUpToEq = confArray[k].match(/^([A-Z]|[a-z]|\-)+\=/);

        if( !itemUpToEq ){
            confOneLinePerItem[j] += trimString(confArray[k]);
        } else{
            j += 1;
            confOneLinePerItem[j] = trimString(confArray[k]);

        }

    }



    for( var i = 0;i < confOneLinePerItem.length;i++ ){



        var eqSign = confOneLinePerItem[i].indexOf("=");
        var property = confOneLinePerItem[i].substr(0, eqSign);
        var value = confOneLinePerItem[i].substr(eqSign + 1);
        var valueString = String(value);

        if( valueString.charAt(0) === "[" ){
            this.properties[property] = JSON.parse(value);
            continue;
        }

        if( property === "" || value === undefined )
            break;
        this.properties[property] = value;
    }



/**
 * removes white spaces from the beginning and the end of the string
 * @param{string} s
 * @returns{string}
 */
    function trimString(s){
        //return s.replace(/^\s+|\s+$/g, "");
    return s.replace(/^\s+|\s+$/g, "");
    }



};


exports.Config = Config;

