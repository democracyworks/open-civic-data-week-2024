const path = require('path');
const express = require('express');
const helmet = require('helmet');
const createError = require('http-errors');
const logger = require('morgan');
const hbs = require('hbs');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.use(helmet());

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/search', async (req, res, next) => {
  const {
    street,
    city,
    state,
    zip,
  } = req.query;
  const url = 'https://www.googleapis.com/civicinfo/v2/representatives?' +
    `key=${process.env.CIVIC_INFO_API_KEY}` +
    `&address=${street} ${city} ${state} ${zip}` +
    `&includeOffices=true`;

  const response = await fetch(url);
  const jsonResponse = await response.json();

  const offices = jsonResponse.offices;
  const officials = jsonResponse.officials;

  // The API response splits offices and officials into separate objects. These
  // objects refer to each other by index.
  for (const office of offices) {
    office.officials = [];
    for (const index of office.officialIndices) {
      office.officials.push(officials[index]);
    }
  }

  // If this header is present in the request, we'll want to render only the
  // partial template. Otherwise, assume that we're navigating directly to
  // the page, and render the index.
  if (req.headers['hx-target']) {
    res.render('partials/result', {offices: offices.reverse()});
  } else {
    res.render('index', {offices: offices.reverse()});
  }
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = err;
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
