const express = require('express')
const path = require('path')
const server = express()
const getColors = require('get-image-colors')
const cors = require("cors")

server.use(cors())

server.get("/", (req, res) => {
    res.send("Hello World")
})

server.post("/upload-image", (req, res) => {
    console.log("REQUEST BODY", req.body)
})

const options = {
    count: 7,
    type: 'image/jpeg'
}


let hslValuesArray = []

let notes = []

function getNotes(hslArr) {
    console.log('hslArr', hslArr)
    if ((0 <= hslArr[0] && hslArr[0] <= 29) && (0 <= (hslArr[1] * 100) && (hslArr[1] * 100) <= 100) && (0 <= (hslArr[2] * 100) && (hslArr[2] * 100) <= 50)) {
        notes.push("F4")
    }
}

getColors(path.join(__dirname, 'soda.jpeg'), options).then(colors => {
    hslValuesArray = colors.map(color => color.hsl())
    for (let i = 0; i < hslValuesArray.length; i++) {
        getNotes(hslValuesArray[i])
    }
})

server.get("/getnotes", (req, res) => {
    res.json({ notes })
})


server.listen("5000", () => { console.log(`Server running at http://localhost:5000`) })
