const db = require("../../models");
const Role = db.role;
const Op = db.Sequelize.Op;
const RefreshTokenValidator = require("./token.validator");
const config = require("../../config/auth.config");
const SignInValidator = require("./siginin.validator");

const SignUpValidator = require("./siginup.validator");

const UserRepo = require("../../repositories/user.Repo");
const RefreshToken = require("../../repositories/token.Repo");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


module.exports.createRefreshToken = async (req)=>{
    

    let validatorResponse = RefreshTokenValidator(req.body);


    if(validatorResponse.status === "validation-error"){
        return validatorResponse;
    }

    console.info('Token validation success');

    const requestToken  = req.body.requestToken;

    try {
        let refreshToken = await RefreshToken.getTokenByTokenKey(requestToken);

        if (!refreshToken) {
            
            return {
                "status" : "error",
                "message" : "Refresh token not found!",
                "code" : 403
            };
        }

        console.info('Token found in database');

        if (RefreshToken.verifyExpiration(refreshToken)) {
            console.log('Refresh token was expired. Please make a new signin request');
            RefreshToken.removeToken(refreshToken);
            console.log('Refresh token removed successfully');
            return {
                "status" : "forbidden",
                "message" : "Refresh token was expired. Please make a new signin request",
                "code" : 403
            };
        }

        const user = await refreshToken.getUser();

        let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        console.info('New token generate successfully');

        return {
            "status" : "success",
            "data" : {
                accessToken: newAccessToken,
                refreshToken: refreshToken.token,
            },
            "code" : 200
        };

    } catch (err) {

        console.error(err);
        return {
            "status" : "error",
            "message" : err,
            "code" : 500
        };
    }


}

module.exports.signIn = async (req)=>{
    
    try {
        
        let validatorResponse = SignInValidator(req.body);

        if(validatorResponse.status === "validation-error"){
            return validatorResponse;
        }


        const user = await UserRepo.getUserByUserName(req.body.username);



        if (!user) {
            
            return {
                "status" : "error",
                "message" : "User Not found.",
                "code" : 404
            };
        }


        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {

            return {
                "status" : "error",
                "accessToken": null,
                "message" : "Invalid Password!",
                "code" : 401
            };
        }

        const token = jwt.sign({ id: user.id },config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            });

        const refreshToken = await RefreshToken.createToken(user);

        var authorities = [];

        const roles = user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        return {
            "status" : "success",
            "data" : {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token,
                refreshToken : refreshToken
            },
            "code" : 200
        };

    } catch (err){
        console.log(err);
        return {
            "status" : "error",
            "message" : err.message,
            "code" : 500
        };
    }


}


module.exports.signUp = async (req)=>{
    
    try {
        
        let validatorResponse = SignUpValidator(req.body);

        if(validatorResponse.status === "validation-error"){
            return validatorResponse;
        }

        const UserData = await UserRepo.createUser(req.body);



        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            });

            UserData.setRoles(roles);

        } else {
            // user role = 1
            UserData.setRoles([1]);
        }


        return {
            "status" : "success",
            "message" : "User Register successfully.",
            "code" : 200
        };


        

    } catch (err){
        console.log(err);
        return {
            "status" : "error",
            "message" : err.message,
            "code" : 500
        };
    }


}