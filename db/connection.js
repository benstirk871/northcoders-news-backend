const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development'

const config = {};

require('dotenv').config({path: `${__dirname}/../.env.${ENV}`})

if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2;
}

const db = new Pool(config);

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("No PGDATABASE configured or DATABASE_URL not set")
} else if (process.env.PGDATABASE){ 
    console.log(`Connected to ${process.env.PGDATABASE}`)
} else if (process.env.DATABASE_URL) {
    console.log(`Connected to ${process.env.DATABASE_URL}`)
}




module.exports = db;