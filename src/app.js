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
  // This object captures the data that will be passed to the template.
  const data = {};

  const {
    street,
    city,
    state,
    zip,
  } = req.query;

  // Query the Civic Info API
  const civicInfoUrl = 'https://www.googleapis.com/civicinfo/v2/representatives?' +
    `key=${process.env.CIVIC_INFO_API_KEY}` +
    `&address=${street} ${city} ${state} ${zip}` +
    `&includeOffices=true`;

  const civicInfoResponse = await fetch(civicInfoUrl);
  const civicInfoJsonResponse = await civicInfoResponse.json();

  const offices = civicInfoJsonResponse.offices;
  const officials = civicInfoJsonResponse.officials;

  // The API response splits offices and officials into separate objects. These
  // objects refer to each other by index.
  for (const office of offices) {
    office.officials = [];
    for (const index of office.officialIndices) {
      office.officials.push(officials[index]);
    }
  }

  // Let's reverse the order of the offices to show the most local first.
  data.offices = offices.reverse();

  // Query the DW API.
  const dwUrl = 'https://api.qa.democracy.works/v2/authorities?' +
    `address=${street} ${city} ${state} ${zip}`;

  const dwResponse = await fetch(dwUrl, {
    headers: {
      'X-API-KEY': process.env.DW_API_KEY,
      'ACCEPT-LANGUAGE': 'en-US',
    },
  });
  const dwJsonResponse = await dwResponse.json();

  // Same as with the civic info API, let's reverse the order of the offices
  // to the most local first.
  data.authorities = dwJsonResponse.data.authorities.reverse();

  // If the 'hx-target' header is present in the request, we'll want to render
  // only the partial template. Otherwise, assume that we're navigating
  // directly to the page, and render the index.
  if (req.headers['hx-target']) {
    res.render('partials/result', {data});
  } else {
    res.render('index', {data});
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
