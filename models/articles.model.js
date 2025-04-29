const db = require("../db/connection")

const selectArticleByID = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({
                status: 404, msg: `No article with article_id of ${article_id}`
            })
        } else {
            return rows[0]
        }
    })
}

const selectArticles = () => {
    return db
    .query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.comment_id):: INT AS comment_count
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id 
    ORDER BY articles.created_at DESC`)
    .then(({rows}) => {
        return rows
    })
}

const updateArticles = (article_id, inc_votes) => {
    if(typeof inc_votes === 'number'){
        return Promise.all([selectArticleByID(article_id)])
        .then(() => {
            return db
            .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*`, [inc_votes, article_id])
        })
        .then(({rows}) => {
            return rows[0]
        })
    } else {
        return Promise.reject({status: 400, msg: "Bad request"})
    }    
}

module.exports = {selectArticleByID, selectArticles, updateArticles}