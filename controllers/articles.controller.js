const {selectArticleByID, selectArticles} = require("../models/articles.model")

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
        
        res.status(200).send({articles})
    })
}

module.exports = {getArticleByID, getArticles}