const selectArticleByID = require("../models/articles.model")

const getArticleByID = (req, res, next) => {
    const {article_id} = req.params;
    
    return selectArticleByID(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

module.exports = getArticleByID