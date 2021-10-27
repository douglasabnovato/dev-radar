const { Router } = require("express");
const axios = require("axios");
const routes = Router();

routes.post("/devs", async (request, response) => { 
    
    const { github_username, techs } = request.body;

    const apiResponse = await axios.get(`http://api.github.com/users/${github_username}`);

    const { name = login, avatar_url, bio } = apiResponse.data;

    console.log(name, avatar_url, bio, github_username, techs);

    return response.json({ message: "Hello @douglasabnovato" });

});

module.exports = routes;