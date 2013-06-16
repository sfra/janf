var INIT_CONFIG = require(process.env.INIT_CONFIG);
var http = require('http'),
        fs = require('fs'),
        ROOT_PATH = INIT_CONFIG.config.ROOT_PATH,
        config = ROOT_PATH + '/system/config',
        View = require(INIT_CONFIG.config.ROOT_PATH + '/system/View'),
        qs = require('querystring'),
		libs = require(ROOT_PATH + "/system/libfile");
//    currentControllerFile = require(INIT_CONFIG.config.ROOT_PATH + "/application/controllers/index.js");





var currentController;



/**
 * @class Controller
 * @constructor
 * @param {Object} request
 * @param {Object} response
 * @param {String} controller name
 * @param {String} action name
 * @param {Object} get parameters
 * @param {String} initial data
 */
Controller = function(req, res, contr, act, GET, dane, mimetype){
    var ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
    var CONFIG = require(process.env.INIT_CONFIG).config;
    this._View = require(ROOT_PATH + '/system/View');
    this._Model = require(ROOT_PATH + '/system/Model/Model');
    this._ModelSync = require(ROOT_PATH + '/system/Model/ModelSync');


    this.req = req;
    this.res = res;
    this.contr = contr;

    if( act == undefined || act == "" ){
        this.act = INIT_CONFIG.config.DEFAULT_ACTION;//"index"
    } else{
        this.act = act;
    }


    this._GET = { };
    var i = 0;

    while( true ){

        if( GET[i] == undefined ){
            break;
        }

        this._GET[GET[i]] = GET[i + 1];
        i += 1;
    }

    this.dane = dane;
    if( mimetype == undefined ){
        res.writeHead(200, { 'Content-Type': 'text/html' });
    }


};

Controller.prototype.setCache = function(data){

    var hash = this.crypto.createHash("sha1").update(this.req.url);

    fs.writeFile(ROOT_PATH + "/application/cache/" + hash.digest('hex'), data, function(err){
        if( err ){
            console.log(err);
        } else{
            console.log("The page was cached!");
        }
    });

}


Controller.prototype.getCache = function(period){
    console.log("CACHE", this.req.url);
    var hash = this.crypto.createHash("sha1").update(this.req.url);

    var out = false;
    var filepath = ROOT_PATH + "/application/cache/" + hash.digest('hex');
    var dateOfMod;
    var dateNow = require('moment').utc().valueOf();
    
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


Controller.prototype.getContent=function(file){
	
	if ( file==undefined ) {
			return libs.toString(ROOT_PATH+"/application/contents/"+this.contr+"."+this.act+".chtml");
	}
	return libs.toString(ROOT_PATH+"/application/contents"+file);
}


Controller.prototype.crypto = require('crypto');
Controller.prototype.libs = require(ROOT_PATH + "/system/libfile");
Controller.prototype.moment = require('moment');
//console.log(require('moment')());


exports.Controller = Controller;
exports.Controller.prototype = Controller.prototype;