var ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
var sql = require(ROOT_PATH + '/system/Model/sql');

/**
 * @class postgresql
 * @inherits Model
 * @constructor
 */
postgresql = function(){

    sql.sql.apply(this, arguments);



    var pg = require('pg');

var connectionString="pg://"+this.config.username+":"+this.config.password+"@"+this.config.host+"/"+this.config.database;
    var connection;
    var that = this;

    
    this.query=function(text){
    pg.connect(connectionString, function(err, client, done) {
      if ( err ) {
            that.emm.emit('dberror');
            console.log( err ); 
        } else{
      that.done=done;
      client.query(text, queryHandler );
      
    }
  });
}


function queryHandler(err, result) {
        if ( err ) {
            that.emm.emit('dberror');
            console.log( err ); 
        } else{
        console.log("result");
        console.log(result);
        that.row = result.rows;
               that.emm.emit('dbOK')
        that.done();
        }
      }
   

}

exports.DB = postgresql;