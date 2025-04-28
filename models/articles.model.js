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
    .query(`SELECT * FROM articles ORDER BY created_at DESC`)
    .then(({rows}) => {
        return rows
    })
}

module.exports = {selectArticleByID, selectArticles}