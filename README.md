# Northcoders News Backend (northcoders-news-backend)

This is the back-end part of my Northcoders News project. This part handles the storage, organisation and availability of the required data.

The project has two main components:

1. Database creation and seeding

2. API development

## Databases

The first part of the project involved creating and seeding PostgreSQL databases. A full test suite was provided by Northcoders to ensure the seeding behavior was working correctly.

## API

Once the databases were set up, I used the Express framework to create an API server with a series of RESTful endpoints. These endpoints allow for CRUD (Create, Read, Update, Delete) requests to be made in the front-end application, so data can be retrieved. This project uses the MVC (Model, View, Controller) paradigm to modularise and organise the code.
A full test suite was also written for the API to ensure:

- Data is retrieved and manipulated correctly

- Errors (e.g. 400: Bad Request, 404: Not Found) are handled properly

## Hosted Version: https://nc-news-backend-d0dj.onrender.com/

There is a link to the hosted vesion above. Requests can be made in the browser by appending the appropriate RESTful endpoint to the URL, for example, https://nc-news-backend-d0dj.onrender.com/api/topics. Please see the 'endpoints.json' file for a list of available endpoints and potential queries.

## Local Version:

If you wish to see and run the code behind this project, please follow the instructions below to clone a local version of this repository to your machine:

### 1. Clone the Repository

- Copy the HTTPS link available through the green <> Code button.
- Open your terminal (CTRL ALT T) and navigate to your desired folder using `cd <filepath>`.
- Clone the repo:
  - `git clone <HTTPS link>`
- Navigate into the repository folder:
  - `cd northcoders-news-backend`
- Open the project in your code editor:
  - `code .`
- Install the required dependencies:
  - `npm install`

Dependencies are listed in the package.json under dependencies and devDependencies.

### 2. Configure .env Files

To allow for connection to the databases, two .env files are required. The file names and variables must be exactly as they are below:

.env.test

- The first is .env.test - Within this file create a variable `PGDATBASE=nc_news_test`

.env.development

- The second is .env.development - Within this file create a variable `PGDATBASE=nc_news`

### 3. Set Up and Seed the Databases

- Create the databases:
  - `npm run setup-dbs`
- To seed the development database:
  - `npm run seed-dev`
- The test database is automatically seeded when the test file 'app.test.js' is run:
  - `npm test app.test.js`

### Local Requests

- To run the API locally:
  - `npm start`
- This runs the listen.js file and opens the server on your local port (default: 9090).
- You can now use API testing software, such as Insomnia or Postman to make requests to:
  - http://localhost:9090/api
- To stop the sever connection:
  - `CTRL C`

### Minimum Requirements

- Node.js: v23.7.0
- Postgres: ^8.14.1
