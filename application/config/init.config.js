var config = { ROOT_PATH: __dirname + "/../..",
    VIEWS_PATH: __dirname + "/../../application/views",
    VIEWS_CONFIGS_PATH: __dirname + "/../../application/views/config",
    APP_URL: "localhost",
    APP_PORT: 1337,
    DEFAULT_CONTROLLER : "index",
    DEFAULT_ACTION : "index"
};


var indexConfig = {
    extToRequest: {
        'css':
                { 'Content-Type': 'text/css', 'addurl': '/application', 'ifempty': '/* empty resource */' },
        'ico':
                { 'Content-Type': 'image/x-icon', 'addurl': '/application/resources/images', 'ifempty': '/* empty resource */' },
        'jpg':
                { 'Content-Type': 'image/jpeg', 'addurl': '/application/resources/images', 'ifempty': '/* empty resource */' },
        'gif':
                { 'Content-Type': 'image/gif', 'addurl': '/application/resources/images', 'ifempty': '/* empty resource */' }

    }

};

var privateData = require(config.ROOT_PATH + '/../privateData').privateData;
var DBConfig = {
    //   adapter:'mysql',
    host: config.APP_URL,
    username: privateData.username, /* Put here */
    password: privateData.password, /* proper  */
    database: privateData.database    /*  data    */
}


exports.config = config;
exports.indexConfig = indexConfig;
exports.DBConfig = DBConfig;