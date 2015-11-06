// Lectures 11 and 12 - CSC 210 Fall 2015
// Philip Guo

// This is the backend for the Fakebook web app, which demonstrates CRUD
// with Ajax using a REST API. (static_files/fakebook.html is the frontend)

// Prerequisites - first run:
//   npm install express
//   npm install body-parser
//
// then run:
//   node server.js
//
// and the frontend can be viewed at http://localhost:3000/fakebook.html

var express = require('express');
var app = express();
// required to support parsing of POST request bodies
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// put all of your static files (e.g., HTML, CSS, JS, JPG) in the static_files/
// sub-directory, and the server will serve them from there. e.g.,:
//
// http://localhost:3000/fakebook.html
// http://localhost:3000/cat.jpg
//
// will send the file static_files/cat.jpg to the user's Web browser
app.use(express.static('static_files'));


// simulates a database in memory, to make this example simple and
// self-contained (so that you don't need to set up a separate database).
// note that a real database will save its data to the hard drive so
// that they become persistent, but this fake database will be reset when
// this script restarts. however, as long as the script is running, this
// database can be modified at will.
var fakeDatabase = [
  {name: 'Philip', email: '123@gmail.com' },
  {name: 'Jane',   email: '234@gmail.com'  },
  {name: 'John',   email: '345@gmail.com' },
];

var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('wanyou.db');



  db.run('CREATE TABLE IF NOT EXISTS wanyou_user (name TEXT, email TEXT)');
 


//db.close();

// CREATE a new user
//
// To test with curl, run:
//   curl -X POST --data "name=Carol&job=scientist&pet=dog.jpg" http://localhost:3000/users
app.post('/users', function (req, res) {
  var postBody = req.body;
  var userName = postBody.name;
  var userEmail= postBody.email;
  // must have a name!
  if (!userName || !userEmail) {
    res.send('ERROR');
    return; // return early!
  }

  // otherwise add the user to the database by pushing (appending)
  // postBody to the fakeDatabase list
 // db.run("INSERT INTO wanyou_user VALUES("+userName+", "+userEmail+")");

//double check
  var newMember=false;
/*
  db.all("SELECT * FROM wanyou_user", function (err, row) {
    return;
   console.log(row);
//   for (var i = 0; i < row.length; i++) {
    //console.log(row[i].email);
    //console.log(row[i].name);
    //console.log(userName+'!');
    //console.log(row[i].name+'?');
      if (row.name==userName)
      { 
        return;
      //  console.log('hello');
      //  newMember=true;
      //  console.log("My value:"+ newMember);
      }
//    }
  });
//
*/
  if (!newMember){
    db.run("INSERT INTO wanyou_user (name, email) VALUES (?,?)", [userName,userEmail]);
 //   console.log(newMember+'%');
  }
  else 
  {
    res.send('accountAlreadyExist');
    return;

  }
  
//db.run("INSERT OR IGNORE INTO wanyou_user (name, email) VALUES (?,?)", [userName,userEmail]);
  /*
  db.all("SELECT * FROM wanyou_user", function(err, row){
  	console.log(row);
  });
	*/
  res.send('OK');
});

// READ profile data for a user
//
// To test with curl, run:
//   curl -X GET http://localhost:3000/users/Philip
//   curl -X GET http://localhost:3000/users/Jane
app.get('/users/*', function (req, res) {
  var EmailToLookup = req.params[0]; // this matches the '*' part of '/users/*' above
  // try to look up in fakeDatabase
/*db.all("SELECT * FROM wanyou_user WHERE email=EmailToLookup", function(err, row){
  	console.log(row);
  }); */
/*db.all("SELECT * FROM wanyou_user", function (err, row) {
	console.log(row);
      }); */

  db.all("SELECT * FROM wanyou_user", function (err, row) {
	//console.log("222");
	 for (var i = 0; i < row.length; i++) {
		//console.log(row[i].email);
		//console.log(row[i].name);
    if (row[i].email==EmailToLookup)
    { 
    	//console.log(row[i].name);
    	res.send(row[i].name);
    	return;
    }}

  });
});

/*
// READ a list of all usernames (note that there's no '*' at the end)
//
// To test with curl, run:
//   curl -X GET http://localhost:3000/users
app.get('/users', function (req, res) {
  var allUsernames = [];

  for (var i = 0; i < fakeDatabase.length; i++) {
    var e = fakeDatabase[i];
    allUsernames.push(e.name); // just record names
  }

  res.send(allUsernames);
});


// UPDATE a user's profile with the data given in POST
//
// To test with curl, run:
//   curl -X PUT --data "job=bear_wrangler&pet=bear.jpg" http://localhost:3000/users/Philip
app.put('/users/*', function (req, res) {
  var nameToLookup = req.params[0]; // this matches the '*' part of '/users/*' above
  // try to look up in fakeDatabase
  for (var i = 0; i < fakeDatabase.length; i++) {
    var e = fakeDatabase[i];
    if (e.name == nameToLookup) {
      // update all key/value pairs in e with data from the post body
      var postBody = req.body;
      for (key in postBody) {
        var value = postBody[key];
        e[key] = value;
      }

      res.send('OK');
      return; // return early!
    }
  }

  res.send('ERROR'); // nobody in the database matches nameToLookup
});


// DELETE a user
//
// To test with curl, run:
//   curl -X DELETE http://localhost:3000/users/Philip
//   curl -X DELETE http://localhost:3000/users/Jane
app.delete('/users/*', function (req, res) {
  var nameToLookup = req.params[0]; // this matches the '*' part of '/users/*' above
  // try to look up in fakeDatabase
  for (var i = 0; i < fakeDatabase.length; i++) {
    var e = fakeDatabase[i];
    if (e.name == nameToLookup) {
      fakeDatabase.splice(i, 1); // remove current element at index i
      res.send('OK');
      return; // return early!
    }
  }

  res.send('ERROR'); // nobody in the database matches nameToLookup
});


*/
// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});
