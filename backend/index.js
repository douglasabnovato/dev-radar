const express = require('express');

const app = express();

app.delete("/users/:id", (request, response) => {
    console.log(request.params)

    let text = 'Hello API REST!';
    console.log(text);

    return response.json({ message: text });
});

app.listen(3333); 