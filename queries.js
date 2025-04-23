const db = require("./db/connection")

const queries = () => {
return db.query(`SELECT * FROM users`)
.then((result) => {//console.log(result.rows)
})
.then(() => {
    return db.query(`SELECT * FROM articles WHERE topic = 'coding'`)
    .then((result) => {/*console.log(result.rows)*/})
})
.then(() => {
    return db.query(`SELECT * FROM comments WHERE votes < 0`)
    .then((result) => {/*console.log(result.rows)*/})
})
.then(() => {
    return db.query(`SELECT slug FROM topics`)
    .then((result) => {
    const topicValues = result.rows.map((topic) => {
        return Object.values(topic)
    })
    //console.log(topicValues.flat())
    })
})
.then(() => {
    return db.query(`SELECT title FROM articles WHERE author = 'grumpy19'`)
    .then((result) => {
    const articles = result.rows.map((article) => {
        return Object.values(article)
    })    
    //console.log(articles.flat())
    })
})
.then(() => {
    return db.query(`SELECT * FROM comments WHERE votes > 10`)
    .then((result) => {
    //console.log(result.rows)
    })
})

}

queries()