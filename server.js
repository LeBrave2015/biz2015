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
var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');

var db = new sqlite3.Database('WanU.db');

db.run('CREATE TABLE IF NOT EXISTS WanU_user (email TEXT PRIMARY KEY, name TEXT, log_in INTEGER, language TEXT, city TEXT, pictures INTEGER)');

// creat account
app.post('/users', function (req, res) {
  var postBody = req.body;
  db.all("SELECT * FROM WanU_user WHERE email='"+postBody.email+"'", function (err, row) {

    if (row.length==0)
    {
      db.run("INSERT INTO WanU_user (email, name, log_in, pictures) VALUES (?,?,?,?)", [postBody.email,postBody.name,0,0]);
   
      var mkdirp = require('mkdirp');   
      mkdirp('static_files/'+postBody.email, function (err) {});
      
      res.send('Account created.');
      return;
    }
    else {
      res.send();
      return;
    }
  });
});

// log in
app.get('/users/*', function (req, res) {

  var userEmail = req.params[0]; 
  db.all("SELECT * FROM WanU_user where email=?",[userEmail], function (err, row) {
    if (row.length!=0){
      if(row[0].log_in==0){
        res.send("OK");
        db.run("UPDATE WanU_user SET log_in=1 where email=?",[userEmail]);
        return;
      }
      else{
        res.send("Fail");
        return;
      }
    }
    else{ 
      res.send();
      return;
    }
  });
});

// log out
app.put('/user/*', function (req, res) {
  var userEmail = req.params[0];
  db.run("UPDATE WanU_user SET log_in=0 where email=?",[userEmail]);
  res.send('OK');
});

// get user preference
app.get('/user_pref/*', function (req, res) {
  var userEmail = req.params[0]; 
    db.all("SELECT * FROM WanU_user WHERE email=?", [userEmail], function(err, row){
      if (row.length!=0){
        var user_pref={name: row[0].name, language: row[0].language, city: row[0].city};
        res.send(user_pref);
        return;
      }
    });
});

// update user preferance
app.post('/user_pref', function (req, res) {
  var postBody = req.body;
  db.run("UPDATE WanU_user SET language=?, city=? where email=?",[postBody.language,postBody.city,postBody.email]);
});

app.post('/image/*', function (req, res) {
  var userEmail = req.params[0]; 
  var form = new formidable.IncomingForm();
  form.uploadDir = __dirname + "\\static_files\\" + userEmail;
  form.parse(req, function(err, fields, files) {
    db.all("SELECT * FROM WanU_user WHERE email=?", [userEmail], function(err, row){
      var numPictures = row[0].pictures;
      numPictures++;
      db.run("UPDATE WanU_user SET pictures=? where email=?",[numPictures,userEmail]);
      fs.renameSync(files.image.path,
                    __dirname + "\\static_files\\" + userEmail+"\\"+numPictures+".jpg");
      res.send("Image Successfully Uploaded.");
    });
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
