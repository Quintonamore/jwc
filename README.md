# JWC Betting App

This is the monorepo for the JWC application. This is a fun project to recreate the fun past time of betting on the outcome of the [Japan World Cup](https://japan-world-cup.fandom.com/wiki/Japan_World_Cup_Wiki) with drinks.

## Frontend Startup

Navigate to the `frontend` directory, and from there run the following commands:

```
npm i
npm start
```

## Backend Startup

Navigate to the `backend` directory, and from there run the following commands:

```
npm i
npm start
```

## Application Overview

To get the full experience locally, you'll need a version of Node.js installed, and any browser to connect to the frontend application.

This project was built lazily so the Backend is storing data in memory instead of on a service that's designed to store data in memory or on disk. All backend logic is in a single file `index.js`.

The frontend is built with React.js and uses Websockets to connect to the backend Node server. The entry point is in the `index.js` file, and from there the file structure is split out into the main `App.js` and the files in the `components` directory which make up different parts of the frontend.
