/*global require, process*/
'use strict';

let Controller = require(require(process.env.INIT_CONFIG).config.ROOT_PATH + '/system/Controller');

/**
 * @class subindex
 * @constructor
 * @inherits Controller.Controller
 */
let errorpage = function(){

    Controller.Controller.apply(this, arguments);



    //begin actions

    this.index = function(){

        let view = new this._View.View('/eview.nhtml', '/main.conf');


        view.getCnf().properties.css = "main.css";
        view.getCnf().properties.title = "Error 404";

        view.getCnf().properties.content = "The page does not exist";


        view.getCnf().properties.list[0]["current"] = "0";
        view.getCnf().properties.list[1]["current"] = "0";
        view.getCnf().properties.list[2]["current"] = "0";
        view.getCnf().properties.list[3]["current"] = "0";
        view.parse();
        let dane = view.render();
        this.res.end(dane);

    }



    //end actions


    //execute action
    this[this.act]();

}


exports.errorpage = errorpage;