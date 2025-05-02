# NC News Backend

This project is an Express server, used to request data from an SQL database. Using Postgres, this project can create and seed test and development databases, to make requests to. There is a link to the hosted vesion below. Please see the endpoints.json file for a list of available endpoints and potential queries.

Hosted Version: https://nc-news-backend-d0dj.onrender.com/

Set-Up Local Version
If you wish to see the code behind this project, please follow the instructions below to clone a local version of this repository to your machine:

Part One - clone repository

- Copy the HTTPS link available through the green <> Code button.
- Navigate to the folder you wish to clone the repo to, by using CD <filepath> in your terminal (ctrl alt t).
- Use the command 'git clone' followed by the HTTPS link.
- CD into the repo, and use the command 'code .' to open this project in your code editor.
- There are several NPM packages required to run this repo, which can be installed by running npm install. The packages are listed in package.json, under devDependencies and dependencies.

Part two - dotenv
To connect to the databases, two .env files are required. The file names and variables must be exactly as they are below:

.env.test

- The first is .env.test - Within this file create a variable PGDATBASE=nc_news_test

.env.development

- The first is .env.development - Within this file create a variable PGDATBASE=nc_news

Part three - seeding the databases

- To create the databases, run the following command: npm run setup-dbs
- To seed the development database use the command: npm run seed-dev
- The test database is automatically seeded when the test file 'app.test.js' is run: npm test app.test.js

Minimum Requirements

- Node.js: v23.7.0
- Postgres: ^8.14.1
