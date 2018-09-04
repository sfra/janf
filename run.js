let exec = require('child_process').exec


let childSocket = null;
let childServer = null;
//child = exec('cd ' + dir + ' && youtube-dl ' + url + ' | less');

//child.on('exit', function (data) {

//});


for(let i=2, max=process.argv.length; i<max;i+=2){
	switch (process.argv[i]){
		case 'dev':
			console.log('dev');
			childSocket = exec('node index.socket.js');
		break;
	};
};

childServer = exec('nodemon index.js',(data)=>{
	console.log('cześć');
});

childServer.stdout.pipe(process.stdout);

