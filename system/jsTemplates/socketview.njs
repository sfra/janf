function messageHandler(e) {
        importScripts('http://@{APP_URL}@:4000/socket.io/socket.io.js');
        let socket=io.connect('http://@{APP_URL}@:4000',{'reconnect': false});

        socket.emit('auth','@{id}@');
        socket.on('results',function(results){ postMessage(results); });
        
        }
        
        
        
 addEventListener("message",messageHandler,true);       