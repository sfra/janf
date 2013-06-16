var ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
var Model = require(ROOT_PATH + '/system/Model/Model');

/**
 * @class sql
 * @inherits Model
 * @constructor
 */
sql = function(){

    Model.Model.apply(this, arguments);


}

exports.sql = sql;