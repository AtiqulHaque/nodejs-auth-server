const Model = require("../models");

const User = Model.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


/**
 * 
 * 
 * @param {any} userData 
 * @returns User
 */
module.exports.createUser = async (userData)=>{

    try {

        return await User.create({
            username: userData.username,
            email: userData.email,
            password: bcrypt.hashSync(userData.password, 8)
        });

    } catch(err){
        console.log(err);

        throw new Error('User Insertion failed');
    }
}

module.exports.getUserByUserName = async (username)=>{

    try {

        return await User.findOne({
            where: {
                username: username
            }
        });

    } catch(err){
        console.log(err);
        throw new Error('User not found');
    }
}


module.exports.getUserByEmail = async (email)=>{

    try {

        return await User.findOne({
            where: {
                email: email
            }
        });

    } catch(err){
        console.log(err);
        throw new Error('Email not found');
    }
}