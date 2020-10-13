const express = require("express")
const path = require("path")
const fs = require("fs")
const port = 100
const app = express()
var connected_stations = []

function clearCashe() {
    const directoryPath = path.join(__dirname, "public");
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('\nUnable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            if (file !== "package.json") { // Making sure not to delete package.json, as it should not be deleted
                if (file.endsWith(".json")) {
                    fs.unlink(`${directoryPath}/${file}`, function(err) {
                        if (err) throw err
                        console.log(`\n${file} deleted`)
                    })
                }
            }
        });
    });
}

clearCashe()
app.use("/static", express.static("public"))

app.get("/station", (req, res) => {
    var queryParameter = req.query

    if ((queryParameter.ID) && (connected_stations.includes(StationData.ID))) {
        StationData = {
            "ID": queryParameter.ID,
            "battery": queryParameter.batteryP,
            "locationX": queryParameter.x,
            "locationY": queryParameter.y,
            "windS": queryParameter.windS,
            "windD": queryParameter.windD,
            "humidity": queryParameter.humidity,
            "rain": queryParameter.rain,
            "time": Date.now(),
        }
        console.log(`Station reconnected:\n ${StationData}`)
    } else {

    }
})

app.get("/station/clear-cashe", function(req, res) {
    clearCashe()
    console.log("\nCashe deleted remotely")
    res.send("Cashe cleared")
})

app.listen(port, () => console.log(`Server listening on port: ${port}`))