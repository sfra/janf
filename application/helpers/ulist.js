function ulist(lst) {

    console.log("IN lst");


    let out="<ul>\n";
    //for( let i=0;i<lst.length;i++ ) {
    //            out="<li>"+lst[i]+"</li>\n";
    //    }

      while ( lst.length !=0 ) {
        out+="<li>"+lst.shift()+"</li>";
            console.log(lst);
      }  
        
        
    return out+"</ul>\n";
    
}


exports.ulist=ulist;