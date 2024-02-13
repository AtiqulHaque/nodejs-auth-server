const Sequelize = require("sequelize");
const Database = require("./../utility/dbConnection");

const dbConnection = Database.getDbConnection();


let connectionCheck = async () =>{
  
  try {
    await dbConnection.authenticate();
    console.log('Connection has been established successfully.');
  } catch(err){
    console.error('Unable to connect to the database: ', err);
  }
}

connectionCheck();

const db = {};

db.Sequelize = Sequelize;
db.sequelize = dbConnection;

db.tutorials = require("./tutorial.model.js")(dbConnection, Sequelize);
db.user = require("./user.model.js")(dbConnection, Sequelize);
db.role = require("./role.model.js")(dbConnection, Sequelize);

db.refreshToken = require("./refreshToken.model.js")(dbConnection, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});

db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});


db.ROLES = ["user", "admin", "moderator"];

module.exports = db;