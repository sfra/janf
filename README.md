# README
janf is a simple MVC framework written in node.js. Just run in the main directory
```
node index.js
```

##Model
Model is in a very basic form. It supports MySql and Postgresql databases so far.
However it implements loading the data in the background, when the page is rendering. For this aim it uses webworkers and socket. 
If you want to use mysql connection, you must provide some configuration. Namelly, edit application/config/init.config.js file, and replace the content

```javascript
let privateData = require(config.ROOT_PATH + 'privateData').privateData;
let DBConfig = {
    //   adapter:'mysql',
    host: config.APP_URL,
    username: privateData.username, /* Put here */
    password: privateData.password, /* proper  */
    database: privateData.database    /*  data    */
}
```
by your details, for example
```javascript
let DBConfig = {
    //   adapter:'mysql',
    host: config.APP_URL,
    username: "login",
    password: "secretpassword",
    database: "shops"
}
```
If you want to query your database from some controller first you create Model object
```javascript
let db = this._Model.ModelFactory({ host: APP_URL }, "mysql");
```
or

```javascript
let db = this._Model.ModelFactory({ host: APP_URL }, "postgresql");
```
then you can make a query, simply

```javascript
let proc = db.query('SELECT * FROM clients');
```
or

```javascript
db.select("name, city").from("clients").where("name = ? AND id > ?",[["John","[A-Za-z]+"],["9","[0-9]+"]]);
```
In the method where there are two parameters: string for which values will be substituted, and array containing
the two element arrays as in the above example
```javasctipt
["John","[A-Za-z]"]
```
where John is the value which will be placed instead of the first question mark, only if the value match
the regular expression /^[A-Za-z]$/. However, validation regular expression is optional.

Then you can execute the prepared statement

```javascript
let proc=db.exec();
```
and when the answer is back, to do something with the results

```javascript
      db.emm.on('dbOK',function(){
                
                  for (let i=0, max=db.row.length; i<max; i++ ) {
                    view.getCnf().properties.content+=db.row[i]['name']+"|"+db.row[i]['city']+ "<br />";
                  };
                  
                  view.parse();
                dane = view.render();

                that.res.end(dane);
                  
                  
                  });

```


##View
View is based on the system of templates. Template looks as ordinary html file and are located in the folder application/views/.
Usually their extension is .nhtml. They are filled by the values defined in config files (located in application/views/config, and have .config as extension)
View is in a fact a class which constructor is called in controller. View takes three paramers:
```javascript
View('/mview.nhtml' , '/main.conf' , {'color':'#330033'})
```
The first one is a file of template on which current view is based. The second is a config file (however it can equal null, when we do not want to use any ).
The last one parameter is a javascript object which extends and overrides properties defined in config file
There is another way to define properties of view. Assume that view has been introduced:
```javascript
let view = new this._View.View('/mview.nhtml', '/main.conf', { 'color': '#330033' });
```
Then the property title can be changed immediately in the following way
```javascript
view.getCnf().properties.title = 'Contact us';
```
Template contains variables of a few types:
Atomic variables are of the form which are filled by the content defined in config file
```
title=Main page
Lists which occur in template in the form
[[list 
some content 
          list]]
```
Inside the list local variables can occur. This types of variables has the different form, namelly {variable}
If config contains the item
```
unlist=[{"cont":"hello","col":"#333221"},{"cont":"world","col":"#21ffee"},{"and others":"hello","col":"#033321"}]
```
then the template
```html
<ul>
[[unlist <li style="color:{col}">{cont}</li> unlist]]
</ul>
```
produces
```html
<ul>
<li style="color:#333321">hello<li>
<li style="color:#21ffee">world</li>
<li style="color:#0333321">and others</li>
</ul>
```
If you want to put the content to a separate file, the folder application/contents/ is for this aim. When, for example you want to have predefined content
for the action main of the controller index create, under the mentioned folder, file index.main.chtml. The content of the file can be associated with the view 
in the following way:
```javascript
view.getCnf().properties.content = this.getContent();
```

Methods of the instation of Controller (actions) loads the view with the typical parameters. Url index/subpage executes the action subpage of the controller index. Additionally index/subpage/user/Jan/age/22 maps to the associtive array this._GET[user=>Jan,age=>22], reachable from the controller.
The controller index with one void action index looks like
```javascript
let ROOT_PATH=require(process.env.INIT_CONFIG).config.ROOT_PATH;
let Controller = require(ROOT_PATH + '/system/Controller');
let libs=require(ROOT_PATH+"/system/libfile");
let socketsingleton=new require(ROOT_PATH+"/system/socketsingleton").Socketsingleton();
/**
* @class index
* @constructor
* @inherits Controller.Controller
*/
let index = function(){

    Controller.Controller.apply(this, arguments);

/*initial values*/
       

    //begin actions

    this.index = function(){

      

    }



    //end actions


    //execute action
    this[this.act]();

}

index.prototype=Controller.Controller.prototype;
exports.index= index;
```
Replace the only action
```javascript
let ROOT_PATH=require(process.env.INIT_CONFIG).config.ROOT_PATH;
let Controller = require(ROOT_PATH + '/system/Controller');
let libs=require(ROOT_PATH+\"/system/libfile\");
let socketsingleton=new require(ROOT_PATH+"/system/socketsingleton").Socketsingleton();
/**
* @class index
* @constructor
* @inherits Controller.Controller
*/
let index = function(){

    Controller.Controller.apply(this, arguments);

/*initial values*/
       

    //begin actions

    this.index = function(){



        let view = new this._View.View('/mview.nhtml');
        view.getCnf().properties.content ='<h1>Hello there!</h1>';

        view.parse();
        dane = view.render();
        this.res.end(dane);

      

    }



    //end actions


    //execute action
    this[this.act]();

}

index.prototype=Controller.Controller.prototype;
exports.index= index;

```

## Command line tool


janf provides command line tool. Put the file janf, which is located in usr/bin, somewhere on your PATH. Moreover, move the folder janf, 
and change the value of the variable JANFPATH in the mentioned file janf, to indicate the folder janf. Optionally you can take the file etc/bash_completion.d/janf and put it to your folder /etc/bash_completion.d/
Now execute
```bash
mkdir MyProject
cd MyProject
janf make app
```
Then the project skeleton will be made. If you want to create new controller just put
```bash
janf make controller supage
```
You can check, that the file subpage.js appeared in folder application/controllers
Back to root of your application. Write in the command line
```bash
janf add action subpage subindex
```
to add action subindex to subpage controller.
At any moment you can ask for some help
```bash
janf help
```
Moreover you can obtain the list of all controllers of the application by putting
```bash
janf show controllers
```
If you are interested in the particular controller, say subpage, the console will show you the answer
```bash
janf show actions subpage
```
