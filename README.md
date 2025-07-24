# NC News Backend

This project uses the framework Express to create an API server, with a series of RESTful endpoints. These endpoints allow for CRUD (Create, Read, Update, Delete) requests to be made in the front-end. There are two main parts to this project: the database creation and seeding, and the API.

## Database

The first part of this project involved creating and seeding a number of SQL databases, using PostgreSQL. A full test suite was provided for me, by Northcoders, to test the seeding behaviour.

## API

Once the databases were set up, I created a series of RESTful endpoints. This project using the MVC (Model, View, Controller) paradigm to modulurise and organise the code.

## Hosted Version: https://nc-news-backend-d0dj.onrender.com/

There is a link to the hosted vesion above. Requests can be made in the browser by adding the RESTful endpoint to the URL, for example, https://nc-news-backend-d0dj.onrender.com/api/topics. Please see the endpoints.json file for a list of available endpoints and potential queries.

## Local Version:

If you wish to see the code behind this project, please follow the instructions below to clone a local version of this repository to your machine:

### Part One - clone repository

- Copy the HTTPS link available through the green <> Code button.
- Navigate to the folder you wish to clone the repo to, by using CD <filepath> in your terminal (ctrl alt t).
- Use the command 'git clone' followed by the HTTPS link.
- CD into the repository folder, and use the command 'code .' to open this project in your code editor.
- There are several NPM packages required to run this repo, which can be installed by running npm install. The packages are listed in package.json, under devDependencies and dependencies.

### Part two - dotenv

To connect to the databases, two .env files are required. The file names and variables must be exactly as they are below:

.env.test

- The first is .env.test - Within this file create a variable PGDATBASE=nc_news_test

.env.development

- The first is .env.development - Within this file create a variable PGDATBASE=nc_news

### Part three - seeding the databases

- To create the databases, run the following command: npm run setup-dbs
- To seed the development database use the command: npm run seed-dev
- The test database is automatically seeded when the test file 'app.test.js' is run: npm test app.test.js

### Local Requests

Requests can also be made locally, using software such as Insomnia:

- Firstly, in the terminal run the command npm run start. This script runs the file 'listen.js', which opens up a local port.
- You can now use API testing software to make requests.

### Minimum Requirements

- Node.js: v23.7.0
- Postgres: ^8.14.1
