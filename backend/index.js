const express = require('express');

const app = express();

app.use(express.json());

app.post("/users", (request, response) => {
    console.log(request.body)

    let text = 'Hello API REST!';
    console.log(text);

    return response.json({ message: text });
});

app.listen(3333); 