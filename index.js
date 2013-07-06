process.env.INIT_CONFIG = __dirname + "/application/config/init.config.js";
var INIT_CONFIG=require(__dirname + "/application/config/init.config");
var indexConfig = require(__dirname+'/application/config/init.config').indexConfig;
require("./system/init/init");

var http = require('http'),
	fs = require('fs'),
	config = require('./system/config'),
	View = require('./system/View'),
	qs = require('querystring'),
	Controller = require('./system/Controller');


var dane;
var matchedReGroups;
var GET = [ ];



var server = http.createServer(function(req, res){


    var fileexten = function(){
        var lastDot = req.url.lastIndexOf('.');
        return [ lastDot > -1 ? true : false,
            req.url.substr(lastDot + 1)
        ];

    }();


    if( req.url === "/" || req.url === "/index.html" ){

//        currentControllerFile = require(__dirname + "/application/controllers/index.js");
	        currentControllerFile = require(__dirname + "/application/controllers/"+
						INIT_CONFIG.config.DEFAULT_CONTROLLER+
						".js");
        currentController = new currentControllerFile[INIT_CONFIG.config.DEFAULT_CONTROLLER](req, res, INIT_CONFIG.config.DEFAULT_CONTROLLER, INIT_CONFIG.config.DEFAULT_ACTION, GET, dane);

    } else if( fileexten[0] && req.url.search("__system__")<0 ){


        try{
            res.writeHead(200, indexConfig.extToRequest[fileexten[1]]['Content-Type']);
        } catch( e ){
            if( e.message.match("Cannot read property \'.*\' of undefined") ){
                currentControllerFile = require(__dirname + "/application/controllers/errorpage.js");
                currentController = new currentControllerFile["errorpage"](req, res, "errorpage", "index", [ ], dane);
            }
        }


        try{
            res.end(fs.readFileSync(__dirname + indexConfig.extToRequest[fileexten[1]]['addurl'] + req.url));
			console.log(__dirname + indexConfig.extToRequest[fileexten[1]]['addurl'] + req.url);
        } catch( e ){
            res.end("/* empty k resource */");
        }


    }


    else{
        var urlArray = req.url.split('/');

        urlArray.shift();
        var contr = urlArray.shift();
        var act = urlArray.shift();

/*release*/

        try {
            if( contr == "__system__" ){
                //res.writeHead(200, "application/javascript");

                currentControllerFile = require(__dirname + "/system/jsController.js");
                console.log("action:", act);
                currentController = new currentControllerFile["jsController"](req, res, "jsController", act.split(".")[0], urlArray, dane, "application/javascript");
            } else if( contr != undefined ){
                currentControllerFile = require(__dirname + "/application/controllers/" + contr + ".js");
                currentController = new currentControllerFile[contr](req, res, contr, act, urlArray, dane);
            } else{
                currentControllerFile = require(__dirname + "/application/controllers/"+INIT_CONFIG.config.DEFAULT_CONTROLLER+".js");
                currentController = new currentControllerFile[INIT_CONFIG.config.DEFAULT_CONTROLLER](req, res, INIT_CONFIG.config.DEFAULT_CONTROLLER, INIT_CONFIG.config.DEFAULT_ACTION, urlArray, dane);
            }
        } catch( e ){
            currentControllerFile = require(__dirname + "/application/controllers/errorpage.js");
            currentController = new currentControllerFile["errorpage"](req, res, "errorpage", "index", urlArray, dane);
			console.log("=====");
			console.log(contr, act);
			console.log(e);
			console.log("-----");
        }

/*release end*/

/*debug*/

//console.log(contr);
//		if (contr=="__system__") {
//			currentControllerFile = require(__dirname + "/system/jsController.js");
//			console.log("urrentControllerFile",currentControllerFile);
//			currentController = new currentControllerFile["jsController"](req, res, "jsController", act, urlArray, dane);
//		}
//
//
//		else if( contr != undefined ){
//                currentControllerFile = require(__dirname + "/application/controllers/" + contr + ".js");
//                currentController = new currentControllerFile[contr](req, res, contr, act, urlArray, dane);
//			}
//
/*debug end*/

    }

});

server.listen(INIT_CONFIG.config.APP_PORT, INIT_CONFIG.config.APP_URL);
console.log('Server running at http://'+INIT_CONFIG.config.APP_URL+':'+INIT_CONFIG.config.APP_PORT+'/');
