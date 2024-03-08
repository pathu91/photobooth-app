const express = require('express');

const app = express();

const port = 80;

app.use(express.static('static'));

app.get('/', (req, res) => {
  console.log('connection made');
  res.sendFile(__dirname + '/index.html');
})

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
})