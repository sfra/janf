var CONFIG = require(process.env.INIT_CONFIG).config;
var ROOT_PATH = CONFIG.ROOT_PATH;
var VIEWS_PATH = CONFIG.VIEWS_PATH;
var VIEWS_CONFIGS_PATH = CONFIG.VIEWS_CONFIGS_PATH;
var fs = require('fs'), config = require(ROOT_PATH + '/system/config');
var libFile = require(ROOT_PATH + '/system/libfile');
var htmlhelper = require(ROOT_PATH + '/system/htmlhelper');
var COMMON_PROPERTIES = require(ROOT_PATH + '/application/views/common/properties').properties;
/**
 * @class View
 * @structor
 * @param {String} view file name
 * @param {String} config file name
 * @param {Array} additional configuration properties
 */
View = function(vw, conf, repl){


    var data;


    var cnf = { 'properties': COMMON_PROPERTIES };

    try{
        fs.lstatSync(vw);
    } catch( e ){
        vw = VIEWS_PATH + vw;
    }

    try{
        fs.lstatSync(conf);
    } catch( e ){

        if( conf != undefined ){

            conf = VIEWS_CONFIGS_PATH + conf;
        }

    }


    cnf.properties.simpleExtend((new Config(conf)).properties);
    this.ext(cnf.properties, repl);
    var that = this;
    data = libFile.toString(vw);

    /**
     * Replaces fields from data by appropriate properties from cnf file
     * @method parse
     * @return {string}
     */
    this.parse = function(){
        for( var prop in cnf.properties ){
            var curr = cnf.properties[prop];

            if( typeof curr === 'object' ){

                while( true ){

                    var beg = data.indexOf("[[" + prop);
                    if( beg == -1 )
                        break;

                    var ed = data.indexOf(prop + "]]");

                    var piece = data.substring(beg + 2 + prop.length, ed); //piece for replacement
                    var pieceOut = "";
                    var index = 0; // start of the iteration on current object

                    for( var pprop in curr ){
                        if( index === curr.length )
                            break; // stop replacement if the end of the object is reached
                        pieceOut += "\n" + piece;

                        for( var subprop in curr[pprop] ){
                            pieceOut = pieceOut.replace("{" + subprop + "}", curr[pprop][subprop]);
                        }

                        index += 1;


                        pieceOut = this.replaceConditionals(pieceOut, curr, pprop, index);


                    }

                    data = data.slice(0, beg) + pieceOut + data.slice(ed + 2 + prop.length, data.lenght);

                }
            } else{

                while( data.indexOf("${" + prop + "}$") > -1 ){
                    data = data.replace("${" + prop + "}$", cnf.properties[prop]);
                }

            }

        }

        data = this.replaceHTMLhelper(data);
        data = this.removeUnusedMarkers(data);
        
        return data;

    }; //end parse
    this.getCnf = function(){
        return cnf;
    };
    this.setCnf = function(){
    };
    this.render = function(){
        return data;
    };
//end of the constuctor
};



/**
 * Parses conditional expressions 
 * @method execute
 * @return {Object} object containing functions that iterpret predicates such as "is", "equals"
 */

View.prototype.execute = function(){
    var negationMode = function(left){

        if( left.charAt(0) === '!' ){
            return function(boolVal){
                return !boolVal;
            }
        } else{
            return function(boolVal){
                return boolVal;
            };
        }

    };

    return { is: function(left, rel, right, body, index, value){
            if( left === "index" ){
                if( right === "odd" && negationMode(left)(index % 2 == 1) ){
                    return body;
                }

                if( right === "even" && negationMode(left)(index % 2 === 0) ){
                    return body;
                }
            }
            ;
            return "";
        },
        equals: function(left, rel, right, body, index, value){
            value = typeof value === "undefined" ? "undefined" : value;

            if( negationMode(left)(right === value) ){
                return body;
            }
            return "";
        }

    };
}(); // end of View.prototype.execute


/* checks if there exists any conditional and execute it */
View.prototype.replaceConditionals = function(text, curr, pprop, index){
    that = this;
    return text.replace(/\$\{\s*if\s(\!?[A-Za-z0-9]*)\s(\S*)\s([A-Za-z0-9#]*)\s?\{(.*)\}\s*\}\$/g,
            function(match, left, rel, right, body, offset, s){
                var value;

                if( curr[pprop][left.replace('!', "")] ){
                    value = curr[pprop][left.replace('!', "")];
                }
                return that.execute[rel](left, rel, right, body, index, value);
            });

} // end of View.prototype.replaceConditionals


View.prototype.replaceHTMLhelper = function(data){

    return  data.replace(/\$\{HTMLhelper\s([A-Za-z]*)\((.*)\)\}\$/g, function(match, hlp, arg, offset, s){

        var argArray = arg.split(',');
        var hp = htmlhelper.Htmlhelper.apply(htmlhelper.Htmlhelper, [ hlp ].concat(argArray));
        return hp.getHelperValue();

    });

}


View.prototype.removeUnusedMarkers = function(text){
    return text.replace(/\[\[[^\[]*\]\]/g, '<!-- removed -->').replace(/\$\{[^\$]*\}\$/g, '<!-- removed -->');
}

/**
 * Extends object cnfProp by properties contained in repl 
 * @method ext
 * @param {object} cnfProp description
 * @param {object} repl description
 */
View.prototype.ext = function(cnfProp, repl){
    var prop;
    for( prop in repl ){
        cnfProp[prop] = repl[prop];
    }

};

View.prototype.parseArguments = function(argStr){
    var out = (typeof argStr == "object" && JSON.parse(arg)) || (argStr instanceof Array) || argStr;

    return out;

}

exports.View = View;