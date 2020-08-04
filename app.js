//jshint esversion:6

/////////////////////////////////////////////////////////////
/////////////////////// BASIC SETUP /////////////////////////
/////////////////////////////////////////////////////////////
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// specify static folder where css,img files are
app.use(express.static("public"));
// use body parser
app.use(bodyParser.urlencoded({ extended: true }));

// let signup.html page as a root page "/"
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

/////////////////////////////////////////////////////////////
/////////////////////// FUNCTIONALITY ///////////////////////
/////////////////////////////////////////////////////////////
// post at root page
app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // data that will be post
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  // api key
  // 88c1cfc50b4badf77c5f8d9fb61f5ab3-us17

  // List id
  // 5121acc69b

  const jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/5121acc69b";
  const options = {
    method: "POST",
    auth: "sungbr95:88ce1cfc50b4badf77c5f8d9fb61f5ab3-us17",
  };

  const request = https.request(url, options, (response) => {
    // if successfully signed up, directs to success page, otherwise directs to failure page
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  // Write the JSON data
  request.write(jsonData);
  request.end();
});

// when fails singing up, redirect to homepage when click the "Try again" button
app.post("/failure", (req, res) => {
  res.redirect("/");
});

/////////////////////////////////////////////////////////////
////////////////////////// LISTEN ///////////////////////////
/////////////////////////////////////////////////////////////
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
