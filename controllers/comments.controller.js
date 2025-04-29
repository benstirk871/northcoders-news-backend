const selectCommentsByArticleId = require("../models/comments.model")

const getCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params

    return selectCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

module.exports = getCommentByArticleId