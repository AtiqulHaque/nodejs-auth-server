const db = require("../../models");
const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;
const Op = db.Sequelize.Op;
const RefreshTokenValidator = require("./token.validator");
const config = require("./../../config/auth.config");
const SignInValidator = require("./siginin.validator");

const SignUpValidator = require("./siginup.validator");


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

module.exports.createRefreshToken = async (req)=>{
    
    let validatorResponse = RefreshTokenValidator(req.body);


    if(validatorResponse.status === "validation-error"){
        return validatorResponse;
    }


    const requestToken  = req.body.requestToken;

    try {
        let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

        if (!refreshToken) {
            
            return {
                "status" : "error",
                "message" : "Refresh token is not in database!",
                "code" : 403
            };
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({ where: { id: refreshToken.id } });

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


        return {
            "status" : "success",
            "data" : {
                accessToken: newAccessToken,
                refreshToken: refreshToken.token,
            },
            "code" : 200
        };

    } catch (err) {
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


        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });


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

        const token = jwt.sign({ id: user.id },
            config.secret,
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

        const UserData = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        });


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