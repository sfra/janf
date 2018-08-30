let CONFIG = require(process.env.INIT_CONFIG).config;
let properties={
    "baseurl":"http://"+CONFIG.APP_URL+":"+CONFIG.APP_PORT,
    "XZYXZ" : 22
}


exports.properties=properties;