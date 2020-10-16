const express = require("express")
const path = require("path")
const fs = require("fs")
const { time } = require("console")
const port = 100
const app = express()
var connected_stations = []
var StationData = {}

function nearNumber(number, x, y) { // Used for finding the closest weatherstation.
    if (x != y) {
        x1 = Math.abs(x - number);
        y1 = Math.abs(y - number);
    
        if (x1 < y1) {
            return x;
        }
        if (y1 < x1) {
            return y;
        }
        return 0;
    }else
      return false;
  }


app.use("/static", express.static("public"))

app.get("/station-send", (req, res) => { // Address for recieving data from the weather stations.
    var queryParameter = req.query

    if (queryParameter.ID) { // Activated when an ID is sent along with the query
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
    } else { // Activated if there is no ID in the query
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

app.get("/station-get", (req, res) => { // Address for sending out data about a specific station, asked for through query.
    var queryParameter = req.query

    res.send(StationData[parseInt(queryParameter.ID)]) // Sends requested station based on ID.
})

app.get("/station-clear", (req, res) => { // Resets all variables that contain info about connected stations and their states.
    connected_stations = []
    StationData = {}
    console.log("\nCashe cleared remotely")
    res.send("Cashe cleared")
})

app.get("/station-get/local", (req, res) => { // Searches through all connected stations, and sends the one that is closest to given coordinates.
    var queryParameter = req.query
    console.log("Hello")

    for (const [key, value] of Object.entries(StationData)) {
        console.log(key)
    }
    res.send("hello world")
})

app.get("/readme", (req, res) => { // Sends the readme file
    res.sendFile(`${__dirname}/README.md`)
    console.log("readme requested")
})

app.get("/favicon", (req, res) => { // Sends favicon for browser chan
    res.sendFile(`${__dirname}/favicon.ico`)
    console.log("favicon requested")
})

app.listen(port, () => console.log(`Server listening on port: ${port}`))