let ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
let sql = require(ROOT_PATH + '/system/Model/sql');

/**
 * @class postgresql
 * @inherits Model
 * @constructor
 */
postgresql = function(){

    sql.sql.apply(this, arguments);



    let pg = require('pg');

let connectionString="pg://"+this.config.username+":"+this.config.password+"@"+this.config.host+":5432/"+this.config.database;
//let connectionString="tcp://"+this.config.username+":"+this.config.password+"@"+this.config.host+"/"+this.config.database;

    let connection;
    let that = this;
    this.query=function(text){
      try {
        
      
    pg.connect(connectionString, function(err, client, done) {
      if ( err ) {
            that.emm.emit('dberror');
            console.log( err ); 
        } else{
      that.done=done;
      client.query(text, queryHandler );
      
    }
  });} catch(e) {
        console.log(e);
      }
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