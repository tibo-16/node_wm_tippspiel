require('./config/config');

const path = require('path');
const express = require('express');
const layout = require('express-layout');
const bodyParser = require('body-parser');
const helmet = require('helmet');

var {mongoose} = require('./db/mongoose');

const routes = require('./routes');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const port = process.env.PORT;

const middlewares = [
  helmet(),
  layout(),
  bodyParser.urlencoded({extended:true}),
  express.static(path.join(__dirname, 'public'))
];

app.use(middlewares);
app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => console.info(`Application running on port ${port}`));