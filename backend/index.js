const express = require('express');
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb+srv://dbDevRadar:douglas1234@cluster0.yg58x.mongodb.net/dbDevRadar?retryWrites=true&w=majority", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
})

app.use(express.json());

app.post("/users", (request, response) => {
    console.log(request.body)

    let text = 'Hello API REST!';
    console.log(text);

    return response.json({ message: text });
});

app.listen(3333); 