const express = require('express');
const fs = require('fs'); // Import fs module to read files
const path = require('path'); // Import path module to handle file paths
const app = express();
const router = express.Router();

app.use(express.json()); // Middleware to parse JSON request bodies

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home.html', (req, res) => {
  // res.send('This is home router');
  res.sendFile(path.join(__dirname, 'home.html'));
});

/*
- Return all details from user.json file to client as JSON format
*/

// Return all details from user.json as JSON
router.get('/profile', (req, res) => {
    fs.readFile(__dirname + "/user.json", (err, data) => {
      if (err) {
        res.status(500).send("Error reading user data");
      } else {
        res.json(JSON.parse(data));
      }
    });
  });
  

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and password is valid then send response as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If password is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req, res) => {
  // Get the username and password from the request body
  const { username, password } = req.body;

  // Read the user data from user.json file
  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ status: false, message: "Server Error" });
    }

    // Parse the user data from JSON
    const users = JSON.parse(data);
    const user = users.find(user => user.username === username);

    // Check if the username is valid
    if (!user) {
      return res.status(401).json({ status: false, message: "User Name is invalid" });
    }

    // Check if the password is valid
    if (user.password !== password) {
      return res.status(401).json({ status: false, message: "Password is invalid" });
    }

    // If both username and password are valid
    return res.json({ status: true, message: "User Is valid" });
  });
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout', (req, res) => {
  const { username } = req.query; // Accept username as query parameter
  res.send(`<b>${username} successfully logged out.</b>`);
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err, req, res, next) => {
  res.status(500).send('Server Error'); // Return 500 status with message
});

app.use('/', router);

app.listen(process.env.port || 8081);

console.log('Web Server is listening at port ' + (process.env.port || 8081));
