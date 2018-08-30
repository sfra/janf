let ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
let Model = require(ROOT_PATH + '/system/Model/Model');

/**
 * @class sql
 * @inherits Model
 * @constructor
 */
sql = function(){

    Model.Model.apply(this, arguments);

    let basicTable;
/**
 * Parts of the prepared sql query
 * @type {Object}
 */
    this.queryScheme={select:"*", from:"", where:"TRUE", join:""};
    
    
    this.select=function(names){
        if( names===undefined ){
            names="*";
        }
        
        if (this.queryScheme.select!="*") {
            this.queryScheme.select+=", "+names;
            return this;
        }
        this.queryScheme.select=names;
        return this;
    };
    
    this.from=function(source){
        basicTable=source.split(",")[0].replace(/^\s+|\s+$/g, "");
        
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
        let qmPosition;
        let index=0;
        let re;

        while( (qmPosition=text.search("\\?"))>-1 ){
  
            re=new RegExp("^"+replacement[index][1]+"$");
            if( replacement[index][1]!==undefined && replacement[index][0].match(re)===null ){
                return this;
            }


            text=text.substring(0,qmPosition)+"'"+(replacement[index])[0]+"'"+text.substring(qmPosition+1);
            index+=1;
        }
        
        this.queryScheme.where=text;
        return this;
    };
   
    /**
     * Summary
     * @param {String} joinedTable the table which will be joined
     * @param {String} existingColumn the column in the base table
     * @param {String} joinedColumn the column in the joined table
     * @returns {sql}  chained object
     */
    this.join=function(joinedTable, existingColumn, joinedColumn){
       
        this.queryScheme.join="JOIN "+joinedTable+" ON "+existingColumn+"="+joinedTable+"."+joinedColumn;
        return this;
    
    }
    
    this.exec=function(){
        
        let query="SELECT "+this.queryScheme.select+" "+"FROM "+this.queryScheme.from+" "+this.queryScheme.join+" WHERE "+this.queryScheme.where+";";
        console.log(query);
        return this.query(query);
    }
    
};

exports.sql = sql;