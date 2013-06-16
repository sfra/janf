var ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
var Model = require(ROOT_PATH + '/system/Model/Model');

/**
 * @class sql
 * @inherits Model
 * @constructor
 */
sql = function(){

    Model.Model.apply(this, arguments);


    this.queryScheme={select:"*", from:"", where:"TRUE"};

    this.select=function(names){
        if( names===undefined ){
            names="*";
        }
        this.queryScheme.select=names;
        return this;
    };
    
    this.from=function(source){
        this.queryScheme.from=source;
        return this;
    };
/**
 * in text replaces ? by rep only if rep match re where [rep,re] is an element of the Array replacement
 * @param {string} text string for preparation
 * @param {Array} replacement array of the form [[rep_0,re_0],[rep1,re_1],...,[rep_0,re_n]]
 * @returns {sql}
 */
    this.where=function(text,replacement){
        var qmPosition;
        var index=0;
        var re;
  
        while( (qmPosition=text.search("\\?"))>-1 ){
  
            re=new RegExp("^"+replacement[index][1]+"$");
            if( replacement[index][1]!==undefined && replacement[index][0].match(re)===null ){
                console.log("argument does not match");
                return this;
            }


            text=text.substring(0,qmPosition)+"'"+(replacement[index])[0]+"'"+text.substring(qmPosition+1);
            index+=1;
        }
        
        this.queryScheme.where=text;
        return this;
    };
    this.exec=function(){
        var query="SELECT "+this.queryScheme.select+" "+"FROM "+this.queryScheme.from+" "+"WHERE "+this.queryScheme.where+";";
        console.log(query);
        return this.query(query);
    }
    
};

exports.sql = sql;