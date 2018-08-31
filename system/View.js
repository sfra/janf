let CONFIG = require(process.env.INIT_CONFIG).config;
let ROOT_PATH = CONFIG.ROOT_PATH;
let VIEWS_PATH = CONFIG.VIEWS_PATH;
let VIEWS_CONFIGS_PATH = CONFIG.VIEWS_CONFIGS_PATH;
let fs = require('fs'), config = require(ROOT_PATH + '/system/config');
let libFile = require(ROOT_PATH + '/system/libfile');
let htmlhelper = require(`${ROOT_PATH}/system/htmlhelper`);
let COMMON_PROPERTIES = require(`${ROOT_PATH}/application/views/common/properties`).properties;
/**
 * @class View
 * @structor
 * @param {String} view file name
 * @param {String} config file name
 * @param {Array} additional configuration properties
 */
View = function(vw, conf, repl){

    let data;
    let cnf = { 'properties': COMMON_PROPERTIES };

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
    let that = this;
    data = libFile.toString(vw);

    /**
     * Replaces fields from data by appropriate properties from cnf file
     * @method parse
     * @return {string}
     */
    this.parse = function(){
        for( let prop in cnf.properties ){
            let curr = cnf.properties[prop];

            if( typeof curr === 'object' ){

                while( true ){

                    let beg = data.indexOf("[[" + prop);
                    if( beg == -1 )
                        break;

                    let ed = data.indexOf(prop + "]]");

                    let piece = data.substring(beg + 2 + prop.length, ed); //piece for replacement
                    let pieceOut = "";
                    let index = 0; // start of the iteration on current object

                    for( let pprop in curr ){
                        if( index === curr.length )
                            break; // stop replacement if the end of the object is reached
                        pieceOut += `\n${piece}`;

                        for( let subprop in curr[pprop] ){
                            pieceOut = pieceOut.replace(`{${subprop}}`, curr[pprop][subprop]);
                        }

                        index += 1;


                        pieceOut = this.replaceConditionals(pieceOut, curr, pprop, index);


                    }

                    data = data.slice(0, beg) + pieceOut + data.slice(ed + 2 + prop.length, data.lenght);

                }
            } else{

                while( data.indexOf("@{" + prop + "}@") > -1 ){
                    data = data.replace("@{" + prop + "}@", cnf.properties[prop]);
                }

            }

        }
//console.log(data);

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
    let negationMode = function(left){

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
            console.log(arguments);
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
    return text.replace(/\@\{\s*if\s(\!?[A-Za-z0-9]*)\s(\S*)\s([A-Za-z0-9#]*)\s?\{(.*)\}\s*\}@/g,
            function(match, left, rel, right, body, offset, s){
                let value;

                if( curr[pprop][left.replace('!', "")] ){
                    value = curr[pprop][left.replace('!', "")];
                }
                
//            console.log('[[[[[[[[[]]]]]]]]]');
//            console.log(curr);    
//            console.log(rel);
//                console.log(match,left, rel, right, body, index, value);
                return that.execute[rel](left, rel, right, body, index, value);
            });

} // end of View.prototype.replaceConditionals


View.prototype.replaceHTMLhelper = function(data){

    return  data.replace(/@\{HTMLhelper\s([A-Za-z]*)\((.*)\)\}@/g, function(match, hlp, arg, offset, s){
        
        let argArray="";
        console.log(arg);

        try {
            argArray=JSON.parse(arg);
            argArray=[argArray];
        } catch(e) {
            console.log("=================");

            console.log(e);

            argArray = arg.split(',');
        }
        
        console.log("--------------------");
        console.log(argArray);
    
        let hp = htmlhelper.Htmlhelper.apply(htmlhelper.Htmlhelper, [ hlp ].concat(argArray));
        return hp.getHelperValue();

    });

}


View.prototype.removeUnusedMarkers = function(text){
    return text;
    //return text.replace(/\[\[[^\[]*\]\]/g, '<!-- removed -->').replace(/@\{[^@]*\}@/g, '<!-- removed -->');
}

/**
 * Extends object cnfProp by properties contained in repl 
 * @method ext
 * @param {object} cnfProp description
 * @param {object} repl description
 */
View.prototype.ext = function(cnfProp, repl){
    let prop;
    for( prop in repl ){
        cnfProp[prop] = repl[prop];
    }

};

View.prototype.parseArguments = function(argStr){
    let out = (typeof argStr == "object" && JSON.parse(arg)) || (argStr instanceof Array) || argStr;

    return out;

}

exports.View = View;