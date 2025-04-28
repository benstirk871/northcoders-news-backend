const express = require("express")
const app = express()
const endpointsJson = require("./endpoints.json")
const getTopics = require("./controllers/topics.controller")


app.get("/api", (req, res) => {
    res.status(200).send({endpoints: endpointsJson})
})

app.get("/api/topics", getTopics)

// app.all("*", (req, res) => {
//     res.status(404).send({msg: "Endpoint not found"})
// })


module.exports = app