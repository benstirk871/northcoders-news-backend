const {selectArticleByID, selectArticles} = require("../models/articles.model")
const formatArticles = require("../util.functions/util.functions")


const getArticleByID = (req, res, next) => {
    const {article_id} = req.params;
    
    return selectArticleByID(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

const getArticles = (req, res) => {
    
    return selectArticles()
    .then((articles) => {
        articles = formatArticles(articles)
        res.status(200).send({articles})
    })
}

module.exports = {getArticleByID, getArticles}