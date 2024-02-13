// app.js
const express = require('express')
const app = express()
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "NodeJS Based Jwt Token Auth server  API with Swagger",
      version: "0.1.0",
      description:
        "This is a  NodeJS Based Jwt Token Auth server made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Md.Atiqul Haque",
        url: "https://atiqul.me",
        email: "mailtoatiqul.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.listen(port, () => console.log(`Hi Example app listening on port ${port}!`))