var clone = require("../libfile").clone;

/**
 * class Model_General
 * @constructor
 * @param {String} name name of the model
 */

Model_General=function(name){
    
    var _name=name;
    
    var tableFields={};
    var _id=null;
    
    /* contains a list of objects field.(its type)*/
    var table=[];
    /**
     * Defines fields of the model and their types
     * method create
     * @param	{Array[Array[2]]}	fields	[field,its type]
     * @param	{Object}	id		indicates main key
     * @returns	{Object}			tableFields
     */
    this.create=function(fields,id){
        for (var i=0;i<fields.length;i++) {
            tableFields[fields[i][0]]=fields[i][1];
            
            if (fields[i][0]==id) {
                _id=id;
            }
        }
        return tableFields;
    }
    
    
    
    /**
     * Checks if the types of row match the types given in table array
     * @param	{Object}	row	Description
     * @returns	{bool}		true if row fulfills the types from table array
     */
    this.validate=function(row){
        
        var out=true;
        
        for (var i in row) {
            out=out && (typeof row[i])==tableFields[i];

        }

        return out;       
    }

    this.addRow=function(row,validate){
        
        for (var field in row) {
            
            if ( !tableFields.hasOwnProperty(field) ) {
                throw "The field "+field+" does not exist in "+_name;
            }
            
        }
        
        
        if (validate && !this.validate(row)) {
            throw "Fields do not match appropriate types of model";
        }
        
        table.push(clone(row));
        
        
    }
   /**
    * Returns row with a given _id
    * @type {Object}
    * @returns {Object}
    */ 
    
    this.find=function(id){
      for(var i = 0;i<table.length;i++){

        if (table[i][_id]==id) {
            return table[i];
        }
        
      }
        return null;
        
    }
    /**
     * Takes an object of the form {field0:string0,field1:string1,...,fieldn:stringn}, where fields are taken form fields, and strings contain the conditions
     * @param	{Object}	filteringObject	object filtering fields
     * @returns	{Object[]}	Array of rows that validate conditions
     */
    this.filter=function(filteringObject){
        debugger;
                
        
        
        var out=[];        
        var currentRow;
        var filteringArray=[];
        for (var i=0;i<table.length;i++) {           
            
            for (var fltr in filteringObject) {
                
                
                
                for(var f in table[i]){
                    filteringArray=this.parseFilter(filteringObject[fltr]);
                    
                    
                    if (tableFields[fltr]=='number') {
                    // filteringObject[fltr]=parseFloat(filteringObject[fltr]);
                    filteringArray[3]=parseFloat(filteringArray[3]);
                }
                    
                    
                    
                    
                    
                    if (f===fltr &&
                        filteringArray[4]===undefined &&
                        this.filterOne.unary(filteringArray,table[i][f])
                        ) {
                        if (filteringArray[1]!=='!') {
                              out.push(table[i]);
                        }
                        

                    } else if ( table[i][f]==fltr && filteringArray[4]!==undefined &&  this.filterOne.binary(filteringArray[2]) ) {
                        //code
                    }
                }       
      
            }
   
        }
    
        return out;   
    }
     
    this.getName=function(){
        return _name;
    }
    
    this.getTableFields=function(){
        return tableFields;
    }
    this.getTable=function(){
        return table;
    }

    
    
    this.buildModel_General=function(name){
    var out=new Model_General(name);
    
    var fields=[];
    for (var i in tableFields) {
        fields.push([i,tableFields[i]]);
    
    }
    
    out.create(fields,_id);
    return out;
    
}
    
    
    
    this.filterOnModel_General=function(name,filteringObject){
        var mgCopy=new this.buildModel_General(name);
        var localTable=this.filter(filteringObject);
        for (var i=0;i<localTable.length;i++) {
            //mgCopy.push(clone( localTable[i] ));
            mgCopy.addRow(clone( localTable[i] ));
            mgCopy.getTable();
        }
        return mgCopy;
    }


  this.create=function(fields,id){
        for (var i=0;i<fields.length;i++) {
            tableFields[fields[i][0]]=fields[i][1];
            
            if (fields[i][0]==id) {
                _id=id;
            }
        }
        return tableFields;
    }

}



Model_General.prototype.parseFilter=function(fltr){
    var re=/^(\!)?([^A-Za-z0-9]*)([A-Za-z0-9]+)([^A-Za-z0-9])?([A-Za-z0-9]*)$/;
    var out=fltr.match(re);
    //console.log("FO");
    //console.log(out);
   
    return out;
}


Model_General.prototype.filterOne={
    
    unary: function(cond,field){
    var out;
    if (cond[1]=='undefined') {
        return field===cond[2];
    }
    
    switch (cond[2]) {
        case "<":
            return field<cond[3]; break;
        case ">":
            return field>cond[3]; break;
        case ">=":
            return field>=cond[3]; break;
        case "<=":
            return field<=cond[3]; break;
    }
    
    
 
    
},
binary:function(cond,field0,field1){
    var out;
    
    switch (cond) {
        case "<":
            return field0<field1; break;
        case ">":
            return field0>field1; break;
        case "<=":
            return field0<=field1; break;
        case ">=":
            return field0>=field1; break;
        case "=":
            return field0==field1; break;
        
        
    }
    
}
    



}












var model=new Model_General("mmodel");

model.create([['id','number'],['imie','string'],['nazwisko','string'],['wiek','number']],'id');
model.addRow({'id':1,'imie':'Jan','nazwisko':'Kowalski','wiek':20});
model.addRow({'id':2,'imie':'Joanna','nazwisko':'Nowak','wiek':45});
model.addRow({'id':3,'imie':'Wojciech','nazwisko':'Jaruzelski','wiek':80});
console.log('Validation:');
//console.log(model.validate({'id':1,'imie':'Jan','nazwisko':'Kowalski'}));
//console.log(model.validate({'id':1,'imie':'Jan','nazwisko':3}));
//console.log(model.getName());
//console.log(model.getTableFields());
//
//
//console.log(model.getTable());
//console.log(model.find(2));
//console.log(model.find(4));
//console.log(model.parseFilter("!>Adam"));
//
//console.log(model.parseFilter("Adam<Wojtek"));
//console.log(model.filter({"wiek":">22"}));
console.log("==============");
//console.log(model.buildModel_General("kopia").getTableFields());

var mg=model.filterOnModel_General("kopia",{"wiek":">22"});
console.log(mg);
console.log(mg.getTable());


exports.Model_General=Model_General;