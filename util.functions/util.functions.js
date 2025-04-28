const db = require("../db/connection")

const formatArticles = (articles) => {
    articles.forEach((article) => {
        delete article.body
        
        let articleId = article.article_id
        const commentCount = db
            .query(`SELECT article_id FROM comments WHERE article_id = $1`, [articleId])
            .then((rows) => {
                return rows.length
            })
        article.comment_count = commentCount
    })

    return articles
}

module.exports = formatArticles