var INIT_CONFIG = require(process.env.INIT_CONFIG);
var ROOT_PATH = INIT_CONFIG.config.ROOT_PATH;
var Model = require(ROOT_PATH + '/system/Model/Model');
var Socketsingleton = require(ROOT_PATH + "/system/socketsingleton");

ModelSync = function(){

    var args = Array.prototype.slice.call(arguments);
    this.connectionId = (new Date()).getTime() + "_" + Math.floor((Math.random() * 999999) + 1);
    this.socketServer = Socketsingleton.Socketsingleton.getInstance();

    this.respon = { };


    this.finishQ = function(res){
        this.respon = { client: this.connectionId, respon: res };

    }

    var that = this;

    this.init = function(){
        var callbackSocket = function(soc){
            {

                //  clients[soc.id]=soc;
                soc.on('auth', function(ci){
                    if( ci == that.respon.client ){
                        soc.emit('results', that.respon.respon);
                        setTimeout(function(){
                            soc.disconnect();
                        }, 1500);

                        //  soc.disconnect();
                    }
                    ;



                });


            }
        }
        
        Socketsingleton.Socketsingleton.getInstance().on('connection', callbackSocket);
       

    };


    this.prepare = function(data, id){
        //that.init();
        var insertion = "<script>" +
                "function messageHandler(e){document.getElementById('" + id + "').innerHTML=e.data;}\n" +
                "var worker=new Worker('/__system__/socketWorker.js/id/" + that.connectionId + "');worker.postMessage('" + that.connectionId + "');console.log(worker);\n" +
                "worker.addEventListener('message',messageHandler,true);</script>";
        //data=data.replace("<head>","<head>"+insertion+"\n");
        data = data.replace("</body>", "\n" + insertion + "</body>");

        return data;
    }












}


ModelSync.socketPool = { };
//ModelSync.io=require('socket.io');
//ModelSync.socketServerStatic=ModelSync.io.listen(4000);



exports.ModelSync = ModelSync;
//exports.prepare=prepare;