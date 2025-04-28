const express = require("express")
const app = express()
const endpointsJson = require("./endpoints.json")
const getTopics = require("./controllers/topics.controller")
const {getArticleByID, getArticles} = require("./controllers/articles.controller")


app.get("/api", (req, res) => {
    res.status(200).send({endpoints: endpointsJson})
})

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleByID)

app.get("/api/articles", getArticles)

app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"})
})

app.use((err, req, res, next) => {
    if(err.code === "22P02"){
        res.status(400).send({msg: "Bad request"})
    }else if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
})


module.exports = app