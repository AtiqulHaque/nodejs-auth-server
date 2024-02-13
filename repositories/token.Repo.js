const Model = require("../models");
const config = require("../config/auth.config");
const Token = Model.refreshToken;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


module.exports.createToken = async (user)=>{

    try {
    
        let expiredAt = new Date();

        expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

        let _token = uuidv4();

        let refreshToken = await Token.create({
            token: _token,
            userId: user.id,
            expiryDate: expiredAt.getTime(),
        });

        return refreshToken.token;

    } catch(err){
        console.log(err);

        throw new Error('Refresh Token Insertion failed');
    }
}

module.exports.verifyExpiration = (token)=>{
    return token.expiryDate.getTime() < new Date().getTime();
}


module.exports.getTokenByTokenKey = async (requestToken) => {

    try {
        return await Token.findOne({ where: { token: requestToken } });
    } catch(err){
        console.log(err);

        throw new Error('Refresh Token not found');
    }
}

module.exports.removeToken = async (refreshToken) =>{
    try{
       return await Token.destroy({ where: { id: refreshToken.id } });
    } catch(err){
        console.log(err);

        throw new Error('Token remove failed');
    }
}
