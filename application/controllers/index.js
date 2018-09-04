let ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
let Controller = require(ROOT_PATH + '/system/Controller');
let libs = require(ROOT_PATH + "/system/libfile");
let socketsingleton = new require(ROOT_PATH + "/system/socketsingleton").Socketsingleton();
/**
 * @class index
 * @constructor
 * @inherits Controller.Controller
 */
let index = function(){

    
    Controller.Controller.apply(this, arguments);

    /*initial values*/

    

    //begin actions

    this.index = function(){

        let view = new this._View.View('/mview.nhtml', '/main.conf', { "color": "#330033" });
        view.getCnf().properties.css = "main.css";


        view.getCnf().properties.content =
                "janf is a simple <a class='inside' href='http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller' >MVC</a> framework written in <a class='inside' href='http://nodejs.org/'>node.js</a><br />\n\
For more information please consult readme.txt";

        view.parse();
        
        this.res.end(view.render());

    }






    this.modelpage = function(){


        let view = new this._View.View('/mview.nhtml', '/main.conf', { "color": "#330033" });
        view.getCnf().properties.css = "main.css";

        libs.switchValues(view.getCnf().properties.list, 'li', 'Model', 'current', '1', '0');

        view.getCnf().properties.content = this.getContent();

        view.parse();
        this.res.end(view.render());

    }



    this.viewpage = function(){

        let dane = this.getCache(30000);

        if( dane ){
            this.res.end(dane);
        } else{

            let view = new this._View.View('/mview.nhtml', '/main.conf', { "color": "#330033" });
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


        let view = new this._View.View('/mview.nhtml', '/main.conf', { "color": "#330033" });
        view.getCnf().properties.css = "main.css";

        libs.switchValues(view.getCnf().properties.list, 'li', 'Controller', 'current', '1', '0');

        view.getCnf().properties.content = this.getContent();
        
        view.parse();
        dane = view.render();
        this.res.end(dane);

    }










    this.commandline = function(){
        let view= new this._View.View('/mview.nhtml','/main.conf');
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