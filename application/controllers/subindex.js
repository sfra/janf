var CONFIG = require(process.env.INIT_CONFIG).config;
var Controller = require(CONFIG.ROOT_PATH + '/system/Controller');
var APP_URL = CONFIG.APP_URL;
/**
 * @class subindex
 * @constructor
 * @inherits Controller.Controller
 */
var subindex = function(){

    Controller.Controller.apply(this, arguments);



    //begin actions



    this.index = function(){

        var view = new this._View.View('/sview.nhtml', '/config.conf', { "color": "#330033" });
        var model = new this._Model.Model(1, 2);

        view.getCnf().properties.title = "SI main page";
        view.getCnf().properties.war = "<p>SUBINDEX main page</p>";
        view.parse();
        dane = view.render();
        this.res.end(dane);

    }


    this.iindex = function(){

        var view = new this._View.View('/view.nhtml', '/config.conf', { "color": "magenta" });
        //  console.log(view.getCnf().properties.list);
        view.getCnf().properties.war = "x=" + this._GET["x"];
        view.getCnf().properties.valueFromNodeJS = 112;
        view.getCnf().properties.title = "DEF";
        view.getCnf().properties.list[7] = { content: "<h1>WELCOME on the <a href='#'>IINDEX</a> subpage</h1>", color: "blue" };
        view.parse();
        dane = view.render();
        this.res.end(dane);

    }




    this.iiindex = function(){

        var db = this._Model.ModelFactory({ }, "mysql");
        var proc = db.query('SELECT * FROM clients WHERE 1');

        proc.on('result', function(row){
            dane += "<br />";
            for( var field in row ){
                if( row.hasOwnProperty(field) ){
                    dane += row[field] + "|";
                }
            }


        });

        proc.on('end', function(res){
            that.res.end(dane);
        });
    }


    this.sock = function(){

        var ModelSync = new this._ModelSync.ModelSync();
        dane = "<html><head></head><body><h1>:++:Results:++:</h1><div id='cont'></div><h2>FOOTER</h2></body>";

        dane = ModelSync.prepare(dane, 'cont');
        var db = this._Model.ModelFactory({ host: APP_URL }, "mysql");
        var proc = db.query('SELECT * FROM clients WHERE 1');


        var contentForSocket = "";

        proc.on('result', function(row){
            dane += "<br />";
            for( var field in row ){
                if( row.hasOwnProperty(field) ){
                    contentForSocket += row[field] + "|";
                }

            }
            contentForSocket += "<br />";

        });

        proc.on('end', function(res){

            ModelSync.finishQ(contentForSocket);

        });

        this.res.end(dane);
        ModelSync.init();

    }

    //end actions


    //execute action
    this[this.act]();

}


exports.subindex = subindex;