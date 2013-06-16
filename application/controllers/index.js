var ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
var Controller = require(ROOT_PATH + '/system/Controller');
var libs = require(ROOT_PATH + "/system/libfile");
var socketsingleton = new require(ROOT_PATH + "/system/socketsingleton").Socketsingleton();
/**
 * @class index
 * @constructor
 * @inherits Controller.Controller
 */
var index = function(){

    Controller.Controller.apply(this, arguments);

    /*initial values*/


    //begin actions

    this.index = function(){

        //   var view = new this._View.View('/mview.nhtml', null, { "color": "#330033" });
        var view = new this._View.View('/mview.nhtml', '/main.conf', { "color": "#330033" });
        //view.getCnf().properties.baseurl = "http://localhost:1337";
        view.getCnf().properties.css = "main.css";
        //console.log(view.getCnf().properties);

        view.getCnf().properties.content =
                "janf is a simple <a class='inside' href='http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller' >MVC</a> framework written in <a class='inside' href='http://nodejs.org/'>node.js</a><br />\n\
For more information please consult readme.txt";

        view.parse();
        dane = view.render();
        this.res.end(dane);

    }






    this.modelpage = function(){


        var view = new this._View.View('/mview.nhtml', '/main.conf', { "color": "#330033" });
        view.getCnf().properties.css = "main.css";

        libs.switchValues(view.getCnf().properties.list, 'li', 'Model', 'current', '1', '0');

        view.getCnf().properties.content = this.getContent();

        view.parse();
        dane = view.render();
        this.res.end(dane);

    }



    this.viewpage = function(){

        var dane = this.getCache(30000);

        if( dane ){
            this.res.end(dane);
        } else{

            var view = new this._View.View('/mview.nhtml', '/main.conf', { "color": "#330033" });
            view.getCnf().properties.css = "main.css";

            libs.switchValues(view.getCnf().properties.list, 'li', 'View', 'current', '1', '0');
            view.getCnf().properties.content = this.getContent();
          
            view.parse();
            dane = view.render();
            this.setCache(dane);
        }
        this.res.end(dane);

    }




    this.controllerpage = function(){


        var view = new this._View.View('/mview.nhtml', '/main.conf', { "color": "#330033" });
        view.getCnf().properties.css = "main.css";

        libs.switchValues(view.getCnf().properties.list, 'li', 'Controller', 'current', '1', '0');

        view.getCnf().properties.content = this.getContent();
        
        view.parse();
        dane = view.render();
        this.res.end(dane);

    }










    this.commandline = function(){
        var view= new this._View.View('/mview.nhtml','/main.conf');
        libs.switchValues(view.getCnf().properties.list,'li', 'Command line', 'current', '1','0');
        view.getCnf().properties.content = this.getContent();
        view.parse();
        dane=view.render();
        this.res.end(dane);
};

//end actions


    //execute action
    this[this.act]();

}

index.prototype = Controller.Controller.prototype;
exports.index = index;