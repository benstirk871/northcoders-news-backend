const db = require("../db/connection")

const selectUsers = () => {
    return db
    .query(`SELECT * FROM users`)
    .then(({rows}) => {
        console.log(rows)
        return rows
    })
}



module.exports = selectUsers