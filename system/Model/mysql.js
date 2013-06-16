var ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
var sql = require(ROOT_PATH + '/system/Model/sql');

/**
 * @class mysql
 * @inherits Model
 * @constructor
 */
mysql = function(){

    sql.sql.apply(this, arguments);

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: this.config.host,
        user: this.config.username,
        password: this.config.password

    });

    var that = this;

    this.query = function(text){

       

        connection.query('USE ' + this.config.database, function(err, row, fields){
            if( err ){
                that.emm.emit('dberror');
            } else{

                that.emm.emit('OK');
            }
        });
        var proc = connection.query(text, function(err, row, fields){
            if( err ){
                that.emm.emit('dberror')
            } else{
                that.row = row;
                that.emm.emit('dbOK');
            }
        });
        connection.end();
        return proc;

    }
}

exports.DB = mysql;