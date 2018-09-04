/*global require, process*/
let INIT_CONFIG = require(process.env.INIT_CONFIG);
let fs = require('fs'),
        ROOT_PATH = INIT_CONFIG.config.ROOT_PATH,
        libs = require(`${ROOT_PATH}/system/libfile`);



/**
 * @class Controller
 * @constructor
 * @param {Object} req request
 * @param {Object} res response
 * @param {String} contr controller name
 * @param {String} act action name
 * @param {Object} GET get parameters
 * @param {String} dane initial data
 * @param {String} mimetype
 */
let Controller = function(req, res, contr, act, GET, dane, mimetype){
    let ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
    this._View = require(`${ROOT_PATH}/system/View`);
    this._Model = require(`${ROOT_PATH}/system/Model/Model`);
    this._ModelSync = require(`${ROOT_PATH}/system/Model/ModelSync`);


    this.req = req;
    this.res = res;
    this.contr = contr;

    if( act === undefined || act === '' ){
        this.act = INIT_CONFIG.config.DEFAULT_ACTION;//"index"
    } else{
        this.act = act;
    }


    this._GET = { };
    let i = 0;

    while( true ){

        if( GET[i] === undefined ){
            break;
        }

        this._GET[GET[i]] = GET[i + 1];
        i += 1;
    }

    this.dane = dane;
    if( mimetype === undefined ){
        res.writeHead(200, { 'Content-Type': 'text/html' });
    }


};

/**
 * Caches the page according to the request url
 * @param{String} data
 */
Controller.prototype.setCache = function(data){

    let hash = this.crypto.createHash("sha1").update(this.req.url);

    fs.writeFile(ROOT_PATH + "/application/cache/" + hash.digest('hex'), data, function(err){
        if( err ){
            console.log(err);
        } else{
            console.log("The page was cached!");
        }
    });

}

/**
 * retrieves the cache only if the cached file is not older than period
 * @param {Number} period time in miliseconds
 * returns {String}
 */
Controller.prototype.getCache = function(period){
  
    let hash = this.crypto.createHash("sha1").update(this.req.url);

    let out = false;
    let filepath = ROOT_PATH + "/application/cache/" + hash.digest('hex');
    let dateOfMod;
    let dateNow = require('moment').utc().valueOf();
    
	try{
       
        dateOfMod = require('moment').utc(fs.statSync(filepath).mtime).valueOf();
    

        if( dateNow - dateOfMod < period ){
            out = this.libs.toString(filepath);
        }

        return out;
    
	} catch( e ){
        console.log(e);
        return out;
    }



}

/**
 * gets the content of the page written in the file with chtml extension, located in application/contents folder
 * @param {String} a name if the file. If is undefined then the name controllerName.actionName.chtml is used
 * @returns {String} Content of the file
 */
Controller.prototype.getContent=function(file){
	
	if ( file==undefined ) {
			return libs.toString(ROOT_PATH+"/application/contents/"+this.contr+"."+this.act+".chtml");
	}
	return libs.toString(ROOT_PATH+"/application/contents"+file);
}


Controller.prototype.crypto = require('crypto');
Controller.prototype.libs = require(ROOT_PATH + "/system/libfile");
Controller.prototype.moment = require('moment');



exports.Controller = Controller;
exports.Controller.prototype = Controller.prototype;