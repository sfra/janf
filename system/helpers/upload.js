'use strict';

const multiparty = require('multiparty');
// const http = require('http');
// const util = require('util');
const fs=require('fs');
const path=require('path');
const fsExtra = require('fs-extra');
const print = require('../../usr/bin/screen').print;

function image(req,res,dest,callback){
    
        let form = new multiparty.Form();

        
        var count = 0;
        let src = null;
        let originalFilename=null;
        form.on('error', (err)=> {
            console.log('Error parsing form: ' + err.stack);
        });

        form.on('file', (err, files)=> {
            print('files: %@', files);
            src = files.path;
            originalFilename = files.originalFilename;
            count++;
        });

        form.on('close', ()=> {
            console.log('Upload completed!');
            // res.setHeader('text/plain');
            // res.end('Received ' + count + ' files');
            console.log('Received ' + count + ' files');
            src = path.normalize(src);
            dest = path.normalize(`${dest}${originalFilename}`); 
            print(src,__filename);
            print(dest,__filename);

//            fs.rename(src,dest),()=>{console.log(arguments);};
            
            fsExtra.copy(src,dest).then(()=>{
                callback(dest);
            }).catch((err)=>{print(err,__filename)});
            
//            setTimeout(()=>{
//            fs.rename(src,dest);
//                
//            },3000);
        });

        form.parse(req, function(err, fields, files) {
//            this.res.writeHead(200, {'content-type': 'text/plain'});
//            this.res.write('received upload:\n\n');
//            this.res.end(util.inspect({fields: fields, files: files}));
//             console.log('fields: %@', fields);
//             console.log('files: %@', files);
        });

    
    
    
    
    
}


exports.image = image;