let CONFIG = require(process.env.INIT_CONFIG).config;
let Controller = require(CONFIG.ROOT_PATH + '/system/Controller');
let APP_URL = CONFIG.APP_URL;
let ROOT_PATH = CONFIG.ROOT_PATH;
let libs = require(ROOT_PATH + '/system/libfile');
let print = require('../../usr/bin/screen').print;
let upload = require(`${ROOT_PATH}/system/helpers/upload`);

/**
 * @class subpage
 * @constructor
 * @inherits Controller.Controller
 */



let subpage = function () {

    Controller.Controller.apply(this, arguments);


    /*initial values*/
    
    let view = new this._View.View('/subpage.nhtml', '/main.conf');
    let navi = new this._View.View('/navi.nhtml', '/navi.conf');
    
    view.getCnf().properties.list = view.getCnf().properties.subpagemenu;





    //begin actions





    this.index = function () {
        let content = this.getCache(30000);

        if (false) {
            this.res.end(content);

        } else {

//        libs.switchValues(view.getCnf().properties.list, 'li', 'GET example', 'current', '1', '0');
    
            
            let view = new this._View.View('/subpage.nhtml', '/main.conf');

        let navi = new this._View.View('/navi.nhtml', '/navi.conf');
        libs.switchValues(navi.getCnf().properties.list, 'li', 'GET example', 'current', '1', '0');
        
        navi.parse();
        
            

        view.getCnf().properties.content = `You think that x=${this._GET['x']} and y=${this._GET['y']}. <br />The object _GET in the context of the current action has been used. It contains all parameters from the url. They are accessible by the expressions:
            <pre>this._GET["x"]</pre>
            However, parameters are sending in the following form:<pre>httt://domainame.org/x/valueOfx/y/valueOfy</pre>
        Change the values in the url of the present page and see the results.`;
             
            
            view.getCnf().properties.valueFromNodeJS = 112;

            view.getCnf().properties.title = "GET example";
            console.log('view.getCnf()');
            console.log(navi.render());
            view.getCnf().properties.navi=navi.render();
            
            view.parse();
            
            let content = view.render();

            this.setCache(content);
            this.res.end(content);
        }

    }




    this.database = function () {

        libs.switchValues(view.getCnf().properties.list, 'li', 'Database', 'current', '1', '0');
        let db = this._Model.ModelFactory({
            host: APP_URL,
            database: "franks"
        }, "postgresql");

        let proc = db.query('SELECT * FROM clients');

        view.getCnf().properties.content = "";

        let that = this;
        db.emm.on('dberror', function () {
            view.getCnf().properties.content = "Something wrong with connection happened.<br /> The current connection" +
                "is suported by postgresql, so if you are use mysql you must change the line" +
                "<pre> let db = this._Model.ModelFactory({ host: APP_URL }, \"postgresql\");</pre> by" +
                " <pre>let db = this._Model.ModelFactory({ host: APP_URL }, \"mysql\");</pre>" +
                "in the current action of subpage controller";

            view.parse();
            that.res.end(view.render());

        });

        db.emm.on('dbOK', function () {

            for (let i = 0, max = db.row.length; i < max; i++) {
                view.getCnf().properties.content += db.row[i]['name'] + "|" + db.row[i]['city'] + "<br />";
            };


            that.res.end(view.render());


        });



    }



    this.databasesec = function () {


        let view = new this._View.View('/subpage.nhtml', '/main.conf');
        let queryView = new this._View.View('/query.nhtml');
        let navi = new this._View.View('/navi.nhtml', '/navi.conf');

        libs.switchValues(navi.getCnf().properties.list, 'li', 'Database 2', 'current', '1', '0');
        
        
        view.getCnf().properties.content = this.getContent('/subpage.databasesec.chtml');
        view.getCnf().properties.valueFromNodeJS = 112;
        view.getCnf().properties.title = 'Database second';
        
        navi.parse();
        view.getCnf().properties.navi = navi.render();



        let that = this;
        let db = this._Model.ModelFactory({
            host: APP_URL
        }, 'mysql');


        db.select('name, city').from('clients').where('name = ? AND id > ?', [['John', '[A-Za-z]+'], ['2', '[0-9]+']]);
        
        let proc = db.exec();


        db.emm.on('dbOK', ()=> {

            queryView.getCnf().properties.results = db.row;

            queryView.parse();

            view.getCnf().properties.content+=queryView.render();
//
            view.parse();
            this.res.end(view.render());


        });

        db.emm.on('dberror', function () {
            view.getCnf().properties.content = `Something wrong with connection happened.<br /> The current connection
            is suported by mysql, so if you use for example
            postgresql you must change the line
                <pre> let db = this._Model.ModelFactory({ host: APP_URL }, "mysql");</pre> by" +
                <pre>let db = this._Model.ModelFactory({ host: APP_URL }, "postgresql");</pre>
                in the current action of subpage controller.<br />
                It is also possible that you do not have database. You can import it from the file resources/janf.sql`;
            view.parse();
            dane = view.render();

            that.res.end(dane);

        });



    };



   





    this.uploads = function () {
        let view = new this._View.View('/mview.nhtml', '/uploads.conf');
        
        let navi = new this._View.View('/navi.nhtml', '/navi.conf');
        
        libs.switchValues(navi.getCnf().properties.list, 'li', 'Handling of uploads', 'current', '1', '0');
        view.getCnf().properties.content = `janf handles uploading files also<br />
        <form action="uploadHandler"/ enctype="multipart/form-data" method="post">
            <input type="file" id="photo" name="photo" />
            <input type="submit" value="save image" name="submit" />
        </form>`;
            view.parse();
            dane = view.render();
    

         this.res.end(dane);
    };


    this.uploadHandler = function () {
        view = new this._View.View('/upload.nhtml', '/main.conf');
        let navi = new this._View.View('/navi.nhtml', '/navi.conf');

        //        let that = this;
        upload.image(this.req, this.res, `${ROOT_PATH}/application/uploads/`, (dest) => {


            
    
//        navi = new this._View.View('/navi.nhtml', '/navi.conf');
        libs.switchValues(navi.getCnf().properties.list, 'li', 'Handling of uploads', 'current', '1', '0');

            
        view.getCnf().properties.content = `The file has been uploaded to <br /><pre>${dest}</pre>`;
        view.getCnf().properties.title = "The file has been uploaded";
        navi.parse();
        view.getCnf().properties.navi = navi.render();
        view.parse();
        dane = view.render();
        this.res.end(dane);
    


        });







    }

    //end actions


    //execute action
    this[this.act]();

}


subpage.prototype = Controller.Controller.prototype;
exports.subpage = subpage;