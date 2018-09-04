'use strict';

let config = `${__dirname}/application/config/init.config.js`;

let INIT_CONFIG = require(config);
let indexConfig = INIT_CONFIG.indexConfig;


process.env.INIT_CONFIG = config;

require('./system/init/init');


let http = require('http'),
  fs = require('fs'),
  dane = null,
  GET = [];



let server = http.createServer(function (req, res) {



  let currentController = null,
    currentControllerFile = null,
    fileexten = (function () {
      let lastDot = req.url.lastIndexOf('.');
      return [lastDot > -1 ? true : false,
        req.url.substr(lastDot + 1)
      ];
    })();

    
    if (indexConfig.extToRequest[fileexten[1]] !== undefined) {

        res.setHeader('Content-Type', indexConfig.extToRequest[fileexten[1]]['Content-Type']);
    }
    


  if (req.url === '/' || req.url === '/index.html') {

    currentControllerFile = require(`${__dirname}/application/controllers/${INIT_CONFIG.config.DEFAULT_CONTROLLER}.js`);
    currentController = new currentControllerFile[INIT_CONFIG.config.DEFAULT_CONTROLLER](req, res, INIT_CONFIG.config.DEFAULT_CONTROLLER, INIT_CONFIG.config.DEFAULT_ACTION, GET, dane);

  } else if (fileexten[0] && req.url.search('__system__') < 0) {


    try {
      res.writeHead('200', indexConfig.extToRequest[fileexten[1]]['Content-Type']);
    } catch (e) {
      if (e.message.match('Cannot read property \'.*\' of undefined')) {
        currentControllerFile = require(`${__dirname}/application/controllers/errorpage.js`);
        currentController = new currentControllerFile['errorpage'](req, res, 'errorpage', 'index', [], dane);
      }
    }


    try {
      res.end(fs.readFileSync(__dirname + indexConfig.extToRequest[fileexten[1]].addurl + req.url));
      console.log(__dirname + indexConfig.extToRequest[fileexten[1]].addurl + req.url);
    } catch (e) {
      res.end('/* empty k resource */');
    }


  } else {

    let urlArray = req.url.split('/');

    urlArray.shift();
    let [contr, act] = [urlArray.shift(), urlArray.shift()];

    /*release*/

    try {

      if (contr === '__system__') {

        currentControllerFile = require(`${__dirname}/system/jsController.js`);
        console.log('action:', act);
        currentController = new currentControllerFile['jsController'](req, res, 'jsController', act.split('.')[0], urlArray, dane, 'application/javascript');

      } else if (contr !== undefined) {

        currentControllerFile = require(`${__dirname}/application/controllers/${contr}.js`);
        currentController = new currentControllerFile[contr](req, res, contr, act, urlArray, dane);

      } else {

        currentControllerFile = require(`${__dirname}/application/controllers/${INIT_CONFIG.config.DEFAULT_CONTROLLER}.js`);
        currentController = new currentControllerFile[INIT_CONFIG.config.DEFAULT_CONTROLLER](req, res, INIT_CONFIG.config.DEFAULT_CONTROLLER, INIT_CONFIG.config.DEFAULT_ACTION, urlArray, dane);

      }
    } catch (e) {
      
        currentControllerFile = require(`${__dirname}/application/controllers/errorpage.js`);
        currentController = new currentControllerFile['errorpage'](req, res, 'errorpage', 'index', urlArray, dane);
        console.log('=====');
        console.log(contr, act);
        console.log(e);
        console.log('-----');
    }

    /*release end*/

    /*debug*/

    //console.log(contr);
    //		if (contr=='__system__') {
    //			currentControllerFile = require(`${__dirname}/system/jsController.js`);
    //			console.log("urrentControllerFile",currentControllerFile);
    //			currentController = new currentControllerFile['jsController'](req, res, 'jsController', act, urlArray, dane);
    //		}
    //
    //
    //		else if( contr != undefined ){
    //                currentControllerFile = require(`${__dirname}/application/controllers/${contr}.js`);
    //                currentController = new currentControllerFile[contr](req, res, contr, act, urlArray, dane);
    //			}
    //
    /*debug end*/

  }

});

server.listen(INIT_CONFIG.config.APP_PORT, INIT_CONFIG.config.APP_URL);
console.log('Server running at http://' + INIT_CONFIG.config.APP_URL + ':' + INIT_CONFIG.config.APP_PORT + '/');
