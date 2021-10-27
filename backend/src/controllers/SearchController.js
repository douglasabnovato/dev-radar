const Dev = require("../models/Dev")
const parseStringAsArray = require("../utils/parseStringAsArray"); 

module.exports = {
    async index(request, response){

        const { latitude, longitude, techs } = request.query;
        const techsArray = parseStringAsArray(techs);

        console.log(techsArray)

        return response.json({ devs: [] });
    }
}