const db = require("../db/connection")
const {selectArticleByID} = require("../models/articles.model")

const selectCommentsByArticleId = (article_id) => {
    return db
    .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC`, [article_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({
                status: 404, msg: `No comments with article_id of ${article_id}`
            })
        } else {
            return rows
        }
    })
}

const insertIntoComments = (article_id, body, username) => {
    if(typeof body === 'string' && body.length > 0){
        return Promise.all([selectArticleByID(article_id), checkUsernameExists(username)])
        .then(() => {
            return db
            .query(`INSERT INTO comments (article_id, body, author) VALUES($1, $2, $3) RETURNING*`, [article_id, body, username])
        })
        .then(({rows}) =>{
            return rows[0]
        })
    } else {
        return Promise.reject({status: 400, msg: "Bad request"})
    }  
}

const checkUsernameExists = (username) => {
    return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
        if (result.rows.length === 0){
            return Promise.reject({status: 404, msg: "User does not exist"})
        }
    })
}

const deleteCommentsByID = (comment_id) => {
    return checkCommentExists(comment_id)
    .then(() => {
        return db
        .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    })
}

const checkCommentExists = (comment_id) => {
    return db
    .query(`SELECT comment_id FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: "Comment does not exist"})
        } 
    })
}



module.exports = {
    selectCommentsByArticleId, 
    insertIntoComments, 
    deleteCommentsByID
};