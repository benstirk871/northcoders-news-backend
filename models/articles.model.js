const db = require("../db/connection")

const selectArticleByID = (article_id) => {
    return db
    .query(`SELECT articles.*, 
    COUNT(comments.comment_id):: INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`, [article_id])
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

const selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
    let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.comment_id):: INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id`

    const topicQueryStr = ` WHERE articles.topic = '${topic}'`
    const validTopicQueries = []
        
    return db
    .query(`SELECT slug FROM topics`)
    .then(({rows}) => {
        rows.forEach((row) => {
            validTopicQueries.push(row.slug)
        })
    })
    .then(() => {

        if(topic && validTopicQueries.includes(topic)){
            queryStr += topicQueryStr
        }
        if(topic && !validTopicQueries.includes(topic)){
            return Promise.reject({status: 400, msg: "Invalid topic query"})
        }
        
        const groupByStr = ` GROUP BY articles.article_id`
        queryStr += groupByStr
        
        const validSortByQueries = ["created_at", "article_id", "votes", "comment_count"]
        if (!validSortByQueries.includes(sort_by)){
            return Promise.reject({status: 400, msg: "Invalid sort query"})
        } else {
            queryStr += ` ORDER BY ${sort_by}`
        }
        
        const validOrderQueries = ["ASC", "DESC"]
        if (!validOrderQueries.includes(order.toUpperCase())){
            return Promise.reject({status: 400, msg: "Invalid order query"})
        } else {
            queryStr += ` ${order}`
        }
    })
    .then(() => {
        return db
        .query(queryStr)
    })
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



module.exports = {
    selectArticleByID, 
    selectArticles, 
    updateArticles
}