const express = require("express")
const path = require("path")
const fs = require("fs")
const port = 100
const app = express()
var connected_stations = []
var StationData = {}

app.use("/static", express.static("public"))

app.get("/station-send", (req, res) => {
    var queryParameter = req.query

    if (queryParameter.ID) {
        StationData[parseInt(queryParameter.ID)] = {
            "battery": queryParameter.batteryP,
            "locationX": queryParameter.x,
            "locationY": queryParameter.y,
            "windS": queryParameter.windS,
            "humidity": queryParameter.humidity,
            "rain": queryParameter.rain,
            "time": Date.now(),
        }
        console.log(`\nStation reconnected: ID=${queryParameter.ID}`)
        res.send(`Reconnected: ${queryParameter.ID}`)
    } else {
        var ID = connected_stations.length
        connected_stations.push(ID)
        StationData[ID] = {
            "battery": queryParameter.batteryP,
            "locationX": queryParameter.x,
            "locationY": queryParameter.y,
            "windS": queryParameter.windS,
            "humidity": queryParameter.humidity,
            "rain": queryParameter.rain,
            "time": Date.now(),
        }
        console.log(`New station connected: ID=${ID}`)
        res.send(`${ID}`)
    }
})

app.get("/station-get", (req, res) => {
    var queryParameter = req.query

    res.send(StationData[parseInt(queryParameter.ID)])
})

app.get("/station-clear", function(req, res) {
    connected_stations = []
    StationData = {}
    console.log("\nCashe cleared remotely")
    res.send("Cashe cleared")
})

app.get("/readme", (req, res) => {
    res.sendFile(`${__dirname}/README.md`)
    console.log("readme requested")
})

app.get("/favicon", (req, res) => {
    res.sendFile(`${__dirname}/favicon.ico`)
    console.log("favicon requested")
})

app.listen(port, () => console.log(`Server listening on port: ${port}`))