// app.js
const express = require('express')
const app = express()

app.use(express.json())

const cors = require("cors");

const port = 3000

var corsOptions = {
  origin: "http://localhost:8082"
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

require("dotenv").config();

const db = require("./models");

const Role = db.role;

// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// });

// function initial() {
//   Role.create({
//     id: 1,
//     name: "user"
//   });

//   Role.create({
//     id: 2,
//     name: "moderator"
//   });

//   Role.create({
//     id: 3,
//     name: "admin"
//   });
// }


app.get('/', (req, res) => {
    res.json({
    "status" : "success",
    "html" : 'Hello World! agains exposed...'
    });

})

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);


app.listen(port, () => console.log(`Hi Example app listening on port ${port}!`))