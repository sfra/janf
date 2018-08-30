var fs=require('fs');
/**
 * For a given path, gives content of a file 
 * @param {string} file
 * @returns {string}
 */
function toString(file) {
    var args = Array.prototype.slice.call(arguments);
    
    
    
    var buffConf={buffString:"",
                LENGTH:1,
                bytesRead:1,
                pos:0,
                fdr:fs.openSync(file, 'r')
                };
    console.log(buffConf.LENGTH);
    var buff = new Buffer(buffConf.LENGTH);


    while ( ( buffConf.bytesRead = fs.readSync(buffConf.fdr, buff, 0, buffConf.LENGTH, buffConf.pos))> 0 ){
        buffConf.buffString+=buff.toString("utf8");
        buffConf.pos += buffConf.bytesRead;

        
    }
  

    
    fs.closeSync(buffConf.fdr)

  return buffConf.buffString;
}

var clone = function(org) {
    if (org instanceof Array) {

        var copy = new Array();

        for (var i = 0, max = org.length; i < max; i++) {
            copy[i] = clone(org[i]);
           
        }
    } else if (typeof org === "object") {
        var copy = {};
        for (var i in org) {
            if(org.hasOwnProperty(i)) copy[i] = clone(org[i]);

                        
        }
    } else {
        
        copy = org;
    }
        console.log('[clone');
    console.log(copy);
        console.log('clone]');

    return copy;

}


var switchValues=function(arr,key,value,key2,value2,other){
    for (var i=0,max=arr.length;i<max;i++) {
        if ( arr[i][key]==value ) {
            arr[i][key2]=value2;
        } else{
            arr[i][key2]=other;
        }
        
    }
 
    
}














exports.toString=toString;
exports.clone=clone;
exports.switchValues=switchValues;