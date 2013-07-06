var CONFIG = require(process.env.INIT_CONFIG).config;
var Controller = require(CONFIG.ROOT_PATH + '/system/Controller');
var APP_URL = CONFIG.APP_URL;
var ROOT_PATH = CONFIG.ROOT_PATH;
var libs = require(ROOT_PATH + "/system/libfile");
/**
 * @class subpage
 * @constructor
 * @inherits Controller.Controller
 */



var subpage = function(){

    Controller.Controller.apply(this, arguments);


    /*initial values*/
    var view = new this._View.View('/mview.nhtml', '/main.conf');
    view.getCnf().properties.list = view.getCnf().properties.subpagemenu;





    //begin actions





    this.index = function(){
        var dane = this.getCache(30000);

        if( dane ){
            this.res.end(dane);

        } else{


            view.getCnf().properties.content = "You think that x=" + this._GET["x"] + " and y=" + this._GET["y"]+"<br />";
            view.getCnf().properties.content+="The object _GET in the context of the current action"+
            "has been used. It contains all parameters from the url. They are accessible by the expressions:"+
            "<pre>this._GET[\"x\"]</pre>"+
            
            "However, parameters are sending in the"+
            " following form:"+
            "<pre>httt://domainame.org/x/valueOfx/y/valueOfy</pre>";
            view.getCnf().properties.content+="Change the values in the url of the present page and see the results."
            
            view.getCnf().properties.valueFromNodeJS = 112;
            view.getCnf().properties.title = "GET example";
            view.parse();
            dane = view.render();
            this.setCache(dane);
        }
        this.res.end(dane);

    }




    this.database = function(){
        var that = this;
        libs.switchValues(view.getCnf().properties.list, 'li', 'Database', 'current', '1', '0');
        var db = this._Model.ModelFactory({ host: APP_URL }, "postgresql");
        

        var proc = db.query('SELECT * FROM clients');

        view.getCnf().properties.content = "";


        db.emm.on('dberror',function(){
            view.getCnf().properties.content = "Something wrong with connection happened.<br /> The current connection"+
            "is suported by postgresql, so if you are use mysql you must change the line"+
            "<pre> var db = this._Model.ModelFactory({ host: APP_URL }, \"postgresql\");</pre> by"+
            " <pre>var db = this._Model.ModelFactory({ host: APP_URL }, \"mysql\");</pre>"+
            "in the current action of subpage controller";
            
               view.parse();
                dane = view.render();

                that.res.end(dane);
            
            });

        db.emm.on('dbOK',function(){
                
                  for (var i=0, max=db.row.length; i<max; i++ ) {
                    view.getCnf().properties.content+=db.row[i]['name']+"|"+db.row[i]['city']+ "<br />";
                  };
                  
                  view.parse();
                dane = view.render();

                that.res.end(dane);
                  
                  
                  });
        


    }



    this.databasesec = function(){
        
        
        var view = new this._View.View('/subpage.nhtml', '/main.conf');

        var navi= new this._View.View('/navi.nhtml','/navi.conf');
        libs.switchValues(navi.getCnf().properties.list, 'li', 'Database 2', 'current', '1', '0');
        view.getCnf().properties.content=this.getContent("/subpage.databasesec.chtml");
        view.getCnf().properties.valueFromNodeJS = 112;
        view.getCnf().properties.title = "Database second";
        navi.parse();
        view.getCnf().properties.navi= navi.render();
        
        
        
       var that = this;
       var db = this._Model.ModelFactory({ host: APP_URL }, "mysql");
       
       console.log(db);
       db.select("name, city").from("clients").where("name = ? AND id > ?",[["John","[A-Za-z]+"],["9","[0-9]+"]]);
 
           var proc=   db.exec();


        db.emm.on('dberror',function(){
            view.getCnf().properties.content = "Something wrong with connection happened.<br /> The current connection"+
            "is suported by mysql, so if you use postgresql you must change the line"+
            "<pre> var db = this._Model.ModelFactory({ host: APP_URL }, \"mysql\");</pre> by"+
            " <pre>var db = this._Model.ModelFactory({ host: APP_URL }, \"postgresql\");</pre>"+
            "in the current action of subpage controller";
               view.parse();
                dane = view.render();

                that.res.end(dane);
            
            });

        db.emm.on('dbOK',function(){
             
                  view.getCnf().properties.results=db.row;
                  
                  view.parse();
                dane = view.render();

                that.res.end(dane);
                  
                  
                  });
    
    };



    this.databasesocket = function(){

        var dane = this.getCache(30000);

        var that=this;
        if( !dane ){

            libs.switchValues(view.getCnf().properties.list, 'li', 'Database socket', 'current', '1', '0');
            view.getCnf().properties.content = "<img src='/loading.gif' style='margin:100px' />";
            view.parse();
            dane = view.render();
            this.setCache(dane);
        }

        var ModelSync = new this._ModelSync.ModelSync();

        dane = ModelSync.prepare(dane, 'content');
        var db = this._Model.ModelFactory({ }, "mysql");
        if( this._GET['ID'] == undefined ){
            this._GET['ID'] = 100;
        }

        //var proc = db.query('SELECT * FROM clients JOIN shops ON clients.id=shops.id_client'+
        //                    ' WHERE `clients`.`id`<' + this._GET["ID"]+
        //                    ' AND shops.trade>100000');

   
        
        db.select("*").from("clients").join("shops","clients.id","id_client").where("clients.id < ? AND shops.trade > ?",[[this._GET["ID"]+"","[0-9]+"],["100000","[0-9]+"]]);
        var proc=db.exec();
        
        var contentForSocket = "";

        
        
             db.emm.on('dberror',function(){
            contentForSocket = "Something wrong with connection happened.<br /> The current connection"+
            "is suported by mysql, so if you use postgresql you must change the line"+
            "<pre> var db = this._Model.ModelFactory({ host: APP_URL }, \"mysql\");</pre> by"+
            " <pre>var db = this._Model.ModelFactory({ host: APP_URL }, \"postgresql\");</pre>"+
            "in the current action of subpage controller";
            
            
             ModelSync.finishQ(contentForSocket);
             
            });

        db.emm.on('dbOK',function(){
               
                  
                  for( var i=0, max=db.row.length; i<max; i++ ) {
                    contentForSocket+=db.row[i]['name']+"|"+db.row[i]['city']+ "<br />";
                  };
                  
                 ModelSync.finishQ(contentForSocket);

                  
                  
                  });
        
        

        this.res.end(dane);
        ModelSync.init();

    }





    this.controller = function(){

        var view = new this._View.View('/subpage.nhtml', '/main.conf');
       
        var navi= new this._View.View('/navi.nhtml','/navi.conf');
        libs.switchValues(navi.getCnf().properties.list, 'li', 'Controller', 'current', '1', '0');
       
       
        
        view.getCnf().properties.content = "CE";
        
        view.getCnf().properties.valueFromNodeJS = 112;
        view.getCnf().properties.title = "Controller example";
        navi.parse();
        view.getCnf().properties.navi= navi.render();
        
        
        view.parse();
        dane = view.render();
        this.res.end(dane);

    }











//end actions


    //execute action
    this[this.act]();

}


subpage.prototype = Controller.Controller.prototype;
exports.subpage = subpage;