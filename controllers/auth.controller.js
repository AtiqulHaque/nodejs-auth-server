const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;
const TokenService = require("./../services/token/token.service");
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    // Save User to Database

    try {
        const response = await TokenService.signUp(req);
        
        console.log(response);

        if(typeof response.status !== "undefined"){
            return res.status(response.code).json(response);
        } else{
            return res.status(500).json("Something went wrong.");
        }

    } catch (err) {
        return res.status(500).send({ message: err });
    }



    // User.create({
    //     username: req.body.username,
    //     email: req.body.email,
    //     password: bcrypt.hashSync(req.body.password, 8)
    // })
    //     .then(user => {
    //         if (req.body.roles) {
    //             Role.findAll({
    //                 where: {
    //                     name: {
    //                         [Op.or]: req.body.roles
    //                     }
    //                 }
    //             }).then(roles => {
    //                 user.setRoles(roles).then(() => {
    //                     res.send({ message: "User was registered successfully!" });
    //                 });
    //             });
    //         } else {
    //             // user role = 1
    //             user.setRoles([1]).then(() => {
    //                 res.send({ message: "User was registered successfully!" });
    //             });
    //         }
    //     })
    //     .catch(err => {
    //         res.status(500).send({ message: err.message });
    //     });
};

exports.signin =  async (req, res) => {

    try {
        const response = await TokenService.signIn(req);
        
        if(typeof response.status !== "undefined"){
            return res.status(response.code).json(response);
        } else{
            return res.status(500).json("Something went wrong.");
        }

    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

exports.refreshToken = async (req, res) => {

    try {
        
        const response = await TokenService.createRefreshToken(req);
        
        if(typeof response.status !== "undefined"){
            return res.status(response.code).json(response);
        } else{
            return res.status(500).json("Something went wrong.");
        }

    } catch (err) {
        return res.status(500).send({ message: err });
    }
};
