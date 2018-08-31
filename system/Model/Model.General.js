let clone = require("../libfile").clone;

/**
 * class Model_General
 * @constructor
 * @param {String} name name of the model
 */

Model_General=function(name){
    /**
     * name of the model
     * @type {string}
     */
    let _name=name;
    /**
     * Contains pairs fieldName.itsType
     * @type {Object}
     */
    let tableFields={};
    /**
     * the name for the main key
     * @type {string}
     */
    let _id=null;
    
    /* contains a list of objects field.(its type)*/
    let table=[];
    /**
     * Defines fields of the model and their types
     * method create
     * @param	{Array[Array[2]]}	fields	[field,its type]
     * @param	{Object}	id		indicates main key
     * @returns	{Object}			tableFields
     */
    this.create=function(fields,id){
        for (let i=0;i<fields.length;i++) {
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
        
        let out=true;
        
        for (let i in row) {
            out=out && (typeof row[i])==tableFields[i];

        }

        return out;       
    }

    this.addRow=function(row,validate){
        
        for (let field in row) {
            
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
     * @param	{string}	id	value of _id
     * @returns	{Object}		row with the given _id
     */
    this.find=function(id){
      for(let i = 0;i<table.length;i++){

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
                
        
        
        let out=[];        
        let currentRow;
        let filteringArray=[];
        for (let i=0;i<table.length;i++) {           
            
            for (let fltr in filteringObject) {
                
                
                
                for(let f in table[i]){
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

    
    /**
     * Creates a new model with the same fields as current
     * @param	{string}	name	name of the created model
     * @returns	{Object}			generated model
     */
    this.buildModel_General=function(name){
    let out=new Model_General(name);
    
    let fields=[];
    for (let i in tableFields) {
        fields.push([i,tableFields[i]]);
    
    }
    
    out.create(fields,_id);
    return out;
    
}
    

    
    /**
     * Generates a model containing the filtered records according to a given filter
     * @param	{string}	name name of the new model 
     * @param	{Object}	filteringObject	filtering conditions
     * @returns	{Object}	new model
     */
    this.filterOnModel_General=function(name,filteringObject){
        let mgCopy=new this.buildModel_General(name);
        let localTable=this.filter(filteringObject);
        for (let i=0;i<localTable.length;i++) {
            mgCopy.addRow(clone( localTable[i] ));
        }
        return mgCopy;
    }


/**
 * Creates new template for a data.
 * @param	{Array[string[2]]}	fields	array of arrays [[field0:type0],[field1:type1],...,[fieldn:typen]]
 * @param	{string}	id		label for id
 * @returns	{Object}			tableFields
 */
  this.create=function(fields,id){
        for (let i=0;i<fields.length;i++) {
            tableFields[fields[i][0]]=fields[i][1];
            
            if (fields[i][0]==id) {
                _id=id;
            }
        }
        return tableFields;
    }
    


}


/**
 * parses a string from filtering object, and returns array of tokens
 * @param	{string}	fltr	condition to be parsed
 * @returns	{Array}			array of tokens
 */
Model_General.prototype.parseFilter=function(fltr){
    let re=/^(\!)?([^A-Za-z0-9]*)([A-Za-z0-9]+)([^A-Za-z0-9])?([A-Za-z0-9]*)$/;
    let out=fltr.match(re);
    return out;
}

/**
 * Object containing two filtering functions
 * @type {Object}
 */
Model_General.prototype.filterOne={
    
    unary: function(cond,field){
    let out;
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
    let out;
    
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












let model=new Model_General("mmodel");

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

let mg=model.filterOnModel_General("kopia",{"wiek":">22"});
//console.log(mg);
//console.log(mg.getTable());


exports.Model_General=Model_General;