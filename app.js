const express = require("express");
const app = express();
const { Vonage } = require('@vonage/server-sdk')
const PORT = process.env.PORT ||5000;
const path = require("path");

// connection of the database
const mongoose = require("mongoose");
const db = 'mongodb+srv://Pankaj:07Jan1975@cluster0.dormclv.mongodb.net/application?retryWrites=true&w=majority'

app.use(express.static(path.join(__dirname, "/public")))


mongoose
  .connect(db, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connection is successfull");
  })
  .catch((e) => {
    console.log(e);
  });

// vonage code
const vonage = new Vonage({
  apiKey: "2a34339b",
  apiSecret: "CvH4OWiURCoyEFLP"
})


// to convert the upcoming data into string because the data coming is in the form of json
app.use(express.json());

// requiring the shema that we have defined
const Blog = require("./db/userSchema");

app.get("/", (req, res) => {
  res.send("this is my server");
});

app.post("/newBlog", (req, res) => {
  const { title, blog } = req.body;

  if (!title || !blog) {
    return res.json({ error: "Please fill the fields properly" });
  }

  const newBlog = new Blog({
    title,
    blog,
  });
  newBlog
    .save()
    .then(() => {
      res.json({ message: "the blog is posted" });
    })
    .catch((err) => {
      console.log(err);
    });
  // .catch(err) => res.json({error :"failed to post the blog"});
});


app.post("/sendsms", (req, res) => {
  const { number, messege } = req.body;
  console.log(number, messege);
 
  const from = "Vonage APIs"
  const to = number;
  const text = messege;
  
  (async function () {
    await vonage.sms.send({to, from, text})
    .then(resp => { console.log('Message sent successfully'); console.log(resp); })
    .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
})();

});

// to get all the data from the database
app.get("/view", (req, res) => {
  Blog.find((err, val) => {
    if (err) res.json(err);
    else res.json({data: val});
  });
});

app.listen(PORT, () => {
  console.log("server is running at port 5000");
});
