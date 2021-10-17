const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const { port, host, db, authApiUrl } = require("./configuration");
const { connectDb } = require("./helpers/db");
const app = express();


const postSchema = new mongoose.Schema({
  name: String
});
const Post = mongoose.model('Post', postSchema);

app.get("/test", (req, res) => {
  res.send("Our api server is working correctly");
});

app.get("/api/testapidata", (req, resp) => {
  resp.json({
    testwithapi: true
  });
});

app.get("/testwithcurrentuser", (req, res) => {
  axios.get(authApiUrl + '/currentUser').then(response => {
    res.json({
      testwithcurrentuser: true,
      currentUserFromAuth: response.data
     });
  });
});

const startServer = () => {
  app.listen(port, () => {
    console.log(`Started api service on port ${port}`);
    console.log(`Our host is ${host}`);
    console.log(`Database url ${db}`);
    
    // Post.find(function(err, posts) {
    //   if (err) return console.error(err);
    //   console.log("posts", posts);
    // });

    const silence = new Post({ name: "Silence" });
    silence.save(function(err, savedSilence) {
      if (err) return console.error(err);
      console.log("savedSilence with volumes!", savedSilence);
    });
    // console.log(silence);
  });
};

connectDb()
  .on("error", console.log)
  .on("disconnected", connectDb)
  .once("open", startServer);
