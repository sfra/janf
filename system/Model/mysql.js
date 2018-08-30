'use strict';

let ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
let sql = require(ROOT_PATH + '/system/Model/sql');

/**
 * @class mysql
 * @inherits Model
 * @constructor
 */
let mysql = function(){

    sql.sql.apply(this, arguments);

    console.log('config');
    console.log(this.config);
    console.log('config');
    let mysql = require('mysql');
    let connection = mysql.createConnection({
        host: this.config.host,
        user: this.config.username,
        password: this.config.password

    });

    let that = this;

    this.query = function(text){

       

        connection.query('USE ' + this.config.database, 
        
        (err, row, fields)=>{
            if( err ){

                that.emm.emit('dberror');
            } else{

                that.emm.emit('OK');
            }
        });
        
        let proc = connection.query(text, function(err, row, fields){
            if( err ){
                that.emm.emit('dberror');
                console.log(err);
            } else{
                that.row = row;
                that.emm.emit('dbOK');
            }
        });
        connection.end();
        return proc;

    };
};

exports.DB = mysql;