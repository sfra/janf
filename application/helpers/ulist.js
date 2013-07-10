function ulist(lst) {

    console.log("IN lst");


    var out="<ul>\n";
    //for( var i=0;i<lst.length;i++ ) {
    //            out="<li>"+lst[i]+"</li>\n";
    //    }

      while ( lst.length !=0 ) {
        out+="<li>"+lst.shift()+"</li>";
            console.log(lst);
      }  
        
        
    return out+"</ul>\n";
    
}


exports.ulist=ulist;