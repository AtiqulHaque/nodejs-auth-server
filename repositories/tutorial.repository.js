const Model = require("./../models");
const Tutorial = Model.tutorials;

/**
 * 
 * 
 * @returns 
 */
module.exports.getAllTutorials = async ()=>{

    try {
        return await Tutorial.findAll();
    } catch(err){
        console.log(err);
        return [];
    }
}