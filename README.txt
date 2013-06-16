About janf
============

janf is a simple MVC framework written in node.js.
Model is in a very basic form. It supports MySql databases so far.
However it implements loading the data in the background, when the page is rendering. For this aim it uses webworkers and socket.

Installing yaml
=================

1) put the folder containing:
	application/
	system/
	index.js
	init.config.js
	init.js

to your public folder.

Install node.js, and the packages socket.io and mysql by the commands

	npm install socket.io
	npm install mysql
or

	npm install -g socket.io
	npm install -g mysql

If you want to use mysql database modify the file init.config.js, by replacing

	var privateData=require('./privateData').privateData;
	var DBConfig={
 	//   adapter:'mysql',
   		host:       'localhost',
   		username:   privateData.username,   /* Put here */
   		password:   privateData.password,   /* propper  */
   		database:   privateData.database    /*  data    */
	}

by the proper values, e.g.

	var DBConfig={
		//   adapter:'mysql',
		host:       'localhost',
		username:   'username',
		password:   'password',
		database:   'mydb'
	}:

When you are done just run:

	node index.js

in the main folder.

Learning more
=============


Getting the source
==================

