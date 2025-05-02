const db = require("../db/connection")

const selectUsers = () => {
    return db
    .query(`SELECT * FROM users`)
    .then(({rows}) => {
        return rows
    })
}

const selectUsersByUsername = (username) => {
    return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: "User doesn't exist"})
        } else {
            return rows[0]
        }
    })
}



module.exports = {
    selectUsers,
    selectUsersByUsername
}