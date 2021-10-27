const { Router } = require("express")
const routes = Router();

routes.post("/users", (request, response) => {
    console.log(request.body)

    let text = 'Hello API REST!';
    console.log(text);

    return response.json({ message: text });
});

module.exports = routes;