const {
    selectUsers,
    selectUsersByUsername
} = require("../models/users.model")

const getUsers = (req, res) => {
    return selectUsers()
    .then((users) => {
        res.status(200).send({users})
    })
}

const getUsersByUsername = (req, res, next) => {
    const {username} = req.params
    
    return selectUsersByUsername(username)
    .then((user) => {
        res.status(200).send({user})
    })
    .catch(next)
}



module.exports = {
    getUsers, 
    getUsersByUsername
}