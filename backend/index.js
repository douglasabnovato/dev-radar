const express = require('express');

const app = express();

app.get('/', (req, res) => {
    return res.json({ message: 'Hello Omnistack 10.0 !' });
});

app.listen(3333);