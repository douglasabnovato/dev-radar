const Dev = require("../models/Dev") 

module.exports = {
    async index(request, response){
        console.log(request.query);
        return response.json({ devs: [] });
    }
}