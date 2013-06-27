# README
janf is a simple MVC framework written in node.js

##Model
Model is in a very basic form. It supports MySql and Postgresql databases so far.
However it implements loading the data in the background, when the page is rendering. For this aim it uses webworkers and socket. 
If you want to use mysql connection, you must provide some configuration. Namelly, edit application/config/init.config.js file, and replace the content

```javascript
var privateData = require(config.ROOT_PATH + '/../privateData').privateData;
var DBConfig = {
    //   adapter:'mysql',
    host: config.APP_URL,
    username: privateData.username, /* Put here */
    password: privateData.password, /* proper  */
    database: privateData.database    /*  data    */
}
```
by your details, for example
```javascript
var DBConfig = {
    //   adapter:'mysql',
    host: config.APP_URL,
    username: "login",
    password: "secretpassword",
    database: "shops"
}
```
If you want to test this page, you need to change two sql queries contained in file application/controllers/subpage.js..

##View
View is based on the system of templates. Template looks as ordinary html file and are located in the folder application/views/.
Usually their extension is .nhtml. They are filled by the values defined in config files (located in application/views/config, and have .config as extension)
View is in a fact a class which constructor is called in controller. View takes three paramers:
```javascript
View('/mview.nhtml','/main.conf',{'color':'#330033'})
```
The first one is a file of template on which current view is based. The second is a config file (however it can equal null, when we do not want to use any ).
The last one parameter is a javascript object which extends and overrides properties defined in config file
There is another way to define properties of view. Assume that view has been introduced:
```javascript
var view = new this._View.View('/mview.nhtml', '/main.conf', { 'color': '#330033' });
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
list=[{"cont":"hello","col":"#333221"},{"cont":"world","col":"#21ffee"},{"and others":"hello","col":"#033321"}]
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
