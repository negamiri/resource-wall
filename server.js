"use strict";

require('dotenv').config();

<<<<<<< HEAD
const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();
const cookieSession = require('cookie-session');
=======
const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const cookieSession = require('cookie-session')
>>>>>>> 0af4d02925a614daaa21f9096fd5839eb611aae0


const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

app.use(cookieSession({
  name: 'session',
  keys: ['userid'],
}))

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const resourcesRoutes = require("./routes/resources");
const collectionsRoutes = require("./routes/collections");
const collectiondetailsRoutes = require("./routes/collectiondetails");
const userscollectionRoutes = require("./routes/userscollection");
const commentsRoutes = require("./routes/comments");
const resourceTitle = require("./routes/resources-title");
const resourceTopic = require("./routes/resources-topic");
const resourceUrl = require("./routes/resources-url");
const editProfileRoutes = require("./routes/editprofile");


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/api/resources", resourcesRoutes(knex));
app.use("/api/collections", collectionsRoutes(knex));
app.use("/api/collectiondetails", collectiondetailsRoutes(knex));
app.use("/api/userscollection", userscollectionRoutes(knex));
app.use("/api/comments", commentsRoutes(knex));
app.use("/api/resources-title", resourceTitle(knex));
app.use("/api/resources-topic", resourceTopic(knex));
app.use("/api/resources-url", resourceUrl(knex));
app.use("/api/editprofile", editProfileRoutes(knex));

// Home page
app.get("/", (req, res) => {
  let templateVars = {
    user: req.session.userid
  };
  res.render("index", templateVars);
});

app.get("/:username/editprofile", (req,res) => {
  let result = checkUsername(req.params.username);
  result.then((value)=>{
    if(value === req.session.userid){
      let templateVars = {
      user: req.session.userid
      };
      res.render("editprofile", templateVars);
    } else{
      res.send("This is not your profile.");
    }
  });
});

app.post("/:username/editprofile", (req,res) => {
  knex('users')
  .where('id', req.session.userid)
  .update({
    name: req.body.updatename,
    username: req.body.updateusername,
    password: req.body.updatepassword,
    photo: req.body.updatephoto
  })
  .then((result) => {
    console.log("Profile updated")
    res.redirect('/:username')
  })
})

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});


// Get username's collection page

app.get("/:username/:collectionname", (req, res) => {
  let templateVars = {
    user: req.session.userid
  }
  res.render("usercollection", templateVars);
});

// Post page + inserting data to db
app.get("/:userid/post", (req, res) => {
  const sessionId = req.session.userid;
  const userId = req.params.userid;
  if (userId == sessionId){
    res.render("urls_post");
  } else {
    res.status(400).end();
  }
});

app.post("/:userid/post", (req, res) => {
  const userId = req.session.userid; 
  const url = req.body.rurl;
  const title = req.body.rtitle;
  const description = req.body.rdescription;
  const topic = req.body.rtopic;
  if (!url || !title || !description || !topic) {
    res.status(400).end();
  } else {
    knex('resources')
    .insert({
      user_id: userId,
      url: req.body.rurl,
      title: req.body.rtitle,
      description: req.body.rdescription,
      topic: req.body.rtopic
    })
    .then(() => {
      res.redirect('/')
    })
  }  
})

// resource details page
app.get("/:resourceid", (req, res) => {    
  res.render('urls_show_resources')
})

app.post("/:resourceid", (req, res) => {
  const userId = req.session.userid;
  const com = req.body.rcomment;
  const resourceid = req.params.resourceid;
  knex('comments')
  .insert({
    user_id: userId,
    resource_id: resourceid,
    comment: com,
    time_stamp: '2019-07-01'
  })
  .then((result) => {
    res.redirect('/' + resourceid);
  })
  

})



app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

<<<<<<< HEAD
//Check user's info (col) based on info we have (info)
//Example info = username (from logging in), we need id (col = id)
function grabUserId (username) {
  for (let key in users) {
    const user = users[key];
    if (user.username === username) {
      return user.id;
    }
  }
}


function getCollectionId (collectionname, userid) {
  for (let key in collections) {
    const collection = collections[key];
    if (collection.name === collectionname && collection.user_id === userid){
      return collection.id;
    }
  }
}

//Creating collection page
app.get("/createcollection", (req, res) => {
  res.render("createcollection")
});

//Create collection
app.post("/createcollection", (req, res) => {
  const collectionname = req.body.collectionname;
  const userid = 1;
  console.log("we are hitting this");
  console.log(userid);
  console.log(collectionname);
  knex('collections')
  .insert({
      user_id: userid,
      name: collectionname
  })
  .then((result)=>{
    console.log("we are done");
    res.redirect(`/`);

  })
})

//Get specific collection
app.get("/:username/:collectionname", (req, res) => {
  let templateVars = {

  }
  res.render("collection");
})
=======

var promise1 = new Promise(function(resolve, reject) {
  resolve('Success!');
});


function checkUsername(username){
  return knex.select("id").from("users").where('username',username)
  .then(function (users){  
    if(users.length>0){
      return Promise.resolve(users[0].id);
    } else {
      return Promise.resolve(0)
    }
    console.log("its after knex query");
  });
}
//Create login
app.post('/', (req, res) => {
  let result = checkUsername(req.body.username);
  result.then((value)=>{
    if(value > 0){
      req.session.userid = value;
      res.redirect("/");
    } else{
      res.send("Incorrect login. Try again.");
    }
  })
});
>>>>>>> 0af4d02925a614daaa21f9096fd5839eb611aae0
