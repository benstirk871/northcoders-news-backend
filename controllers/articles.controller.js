const {
    selectArticleByID, 
    selectArticles, 
    updateArticles
} = require("../models/articles.model")

const getArticleByID = (req, res, next) => {
    const {article_id} = req.params;
    
    return selectArticleByID(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

const getArticles = (req, res, next) => {
    const {sort_by, order, topic} = req.query
            
    return selectArticles(sort_by, order, topic)
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}

const patchArticleByID = (req, res, next) => {
    
    const {article_id} = req.params
    const {inc_votes} = req.body
    
    return updateArticles(article_id, inc_votes)
    .then((updatedArticle) => {
        res.status(200).send({updatedArticle})
    })
    .catch(next)
}

module.exports = {
    getArticleByID, 
    getArticles, 
    patchArticleByID
}