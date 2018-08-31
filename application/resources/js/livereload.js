'use strict';
window.onload = ()=>{

let socket = io.connect('http://0.0.0.0:3000');
    socket.on('fs',()=>{
        document.location.href=document.location.href;

    });
    
    socket.on('hello',(data)=>{
        console.log(data);
    });
};