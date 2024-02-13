const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const UserRepo = require("./../repositories/user.Repo");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
   
    if(typeof req.body.username !== "undefined"){
        const userData = await UserRepo.getUserByUserName(req.body.username);

        if(userData){
            res.status(400).send(
            {
                "status" : "error",
                "message" :  "Failed! Username is already in use!",
                "code" : 400
            });
            
            return;
        }
    }
    

    if(typeof req.body.email !== "undefined"){

        const userEmailData = await UserRepo.getUserByEmail(req.body.email);

        if(userEmailData){
            res.status(400).send({
                    "status" : "error",
                    "message" : "Failed! Email is already in use!",
                    "code" : 400
                });

            return;
        }
    }

    

    next();

};

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: "Failed! Role does not exist = " + req.body.roles[i]
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;