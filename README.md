# open-civic-data-week-2024

## About

This demo web application uses the Civic Information API to power a basic voter portal. Users may submit an address and be presented with some information about their representatives.

## Installing & running the application

Running this demo with docker compose (recommended) requires installing [Docker](https://docs.docker.com/get-docker/). To start the app in development mode, run:

`make dev`

Navigate to [localhost:3000](http://localhost:3000/) to visit the app.

Alternatively, install [Node JS](https://nodejs.org/en/download) and run the following:
```javascript
npm install && npm run dev
```

## Dependencies

The demo uses [Express](https://expressjs.com/en/guide/routing.html), [HTMX](https://htmx.org/docs/), and [Handlebars](https://handlebarsjs.com/guide/#what-is-handlebars).

## About Democracy Works

Democracy Works is a nonpartisan, nonprofit organization that collaborates with election officials, leading tech platforms, and world-class partners to drive voter access and participation. Learn more at [our website](https://www.democracy.works/).

## Relevant links
* [Google Civic Information API Homepage](https://developers.google.com/civic-information) 
* [Google Civic Information API Reference](https://developers.google.com/civic-information/docs/v2) 
* [How to provision credentials for the Civic Info API](https://developers.google.com/civic-information/docs/using_api#APIKey)
* [DW API Documentation](https://developers.democracy.works/api/v2)
