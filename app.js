const express = require("express")
const app = express()
const endpointsJson = require("./endpoints.json")
const getTopics = require("./controllers/topics.controller")
const {
    getArticleByID, 
    getArticles, 
    patchArticleByID
} = require("./controllers/articles.controller")
const {
    getCommentsByArticleId, 
    postCommentByArticleId, 
    removeCommentsByID
} = require("./controllers/comments.controller")
const getUsers = require("./controllers/users.controller")

app.use(express.json())

app.get("/api", (req, res) => {
    res.status(200).send({endpoints: endpointsJson})
})

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleByID)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleByID)

app.delete("/api/comments/:comment_id", removeCommentsByID)

app.get("/api/users", getUsers)

app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"})
})

app.use((err, req, res, next) => {
    if(err.code === "22P02"){
        res.status(400).send({msg: "Bad request"})
    } else if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
})


module.exports = app