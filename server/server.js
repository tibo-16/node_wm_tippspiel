const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (request, response) =>  response.sendFile(`${__dirname}/index.html`));

app.post('/submitted', (request, response) => {
  const postBody = request.body;
  console.log(postBody);
  response.send(postBody);
});

app.listen(3000, () => console.info('Application running on port 3000'));