// Prerequisites - first run:
//   npm install express
//   npm install body-parser
//
// then run:
//   node server.js
//

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('static_files'));

var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('WanU.db');

db.run('CREATE TABLE IF NOT EXISTS WanU_user (name TEXT, email TEXT)');
db.run('CREATE TABLE IF NOT EXISTS WanU_user_info (name TEXT, email TEXT)');

// CREATE a new user
app.post('/users', function (req, res) {
  var postBody = req.body;
  var userName = postBody.name;
  var userEmail= postBody.email;
  
  // must have a name!
  if (!userName || !userEmail) {
    res.send('ERROR: need more Information');
    return; // return early!
  }

  var newMemberName=true;
  var newMemberEmail=true;

  db.all("SELECT * FROM WanU_user", function (err, row) {
    for (var i = 0; i < row.length; i++) {
      if (row[i].name==userName)     
      { 
      newMemberName=false;
      }
      if (row[i].email==userEmail)     
      { 
      newMemberEmail=false;
      }
    }
    if (newMemberName && newMemberEmail){
      db.run("INSERT INTO WanU_user (name, email) VALUES (?,?)", [userName,userEmail]);
      res.send('Account created');
      console.log('Account created');
    }
    else 
    {
      if (!newMemberName)res.send('Error: name already exists.');
      if (!newMemberEmail)res.send('Error: email already exists');
    }

  });
  
  return;
});


app.get('/users/*', function (req, res) {
  var EmailToLookup = req.params[0]; 
  db.all("SELECT * FROM WanU_user", function (err, row) {
    for (var i = 0; i < row.length; i++) {
      if (row[i].email==EmailToLookup)
      { 
    	 res.send(row[i].name);
    	 return;
      }
    }
    res.send();
  });
  return;
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
