let Controller = require(require(process.env.INIT_CONFIG).config.ROOT_PATH + '/system/Controller');


let APP_URL = require(process.env.INIT_CONFIG).config.APP_URL;
/**
 * @class jsCotroller
 * @constructor
 * @inherits Controller.Controller
 */
let jsController = function(){

    Controller.Controller.apply(this, arguments);



    //begin actions

    this.index = function(){

        /*        let view = new this._View.View('/sview.nhtml', '/config.conf', { "color": "#330033" });
         
         view.getCnf().properties.title = "main page";
         view.getCnf().properties.war = "<p>hello</p>";
         view.parse();
         dane = view.render();
         this.res.end(dane);
         */
    }


    this.socketWorker = function(){
        let view = new this._View.View('/../../system/jsTemplates/socketview.njs', null, { "APP_URL": APP_URL, "id": this._GET["id"] });
        view.parse();
        dane = view.render();

        this.res.setHeader("Content-Type", "application/javascript");
        this.res.end(dane);
    }

    //end actions


    //execute action
    this[this.act]();

}


exports.jsController = jsController;