const {
    selectCommentsByArticleId, 
    insertIntoComments, 
    deleteCommentsByID
} = require("../models/comments.model")

const getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params

    return selectCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

const postCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {body, username} = req.body

    return insertIntoComments(article_id, body, username)
    .then((newlyPostedComment) => {
        res.status(201).send({newlyPostedComment})
    })
    .catch(next)
}

const removeCommentsByID = (req, res, next) => {
    const {comment_id} = req.params

    return deleteCommentsByID(comment_id)
    .then(() => {
        res.status(204).send({})
    })
    .catch(next)
    
}



module.exports = {
    getCommentsByArticleId, 
    postCommentByArticleId, 
    removeCommentsByID
}