const express = require('express')
const path = require('path')
const server = express()
const getColors = require('get-image-colors')
const cors = require("cors")
const bodyParser = require('body-parser')

server.use(cors())
server.use(bodyParser.json({ limit: '10mb' }));
server.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


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

server.post("/upload-image", (req, res) => {
    console.log("REQUEST BODY", req.body)
    notes = []
    let base64Data = req.body.file.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

    require("fs").writeFile("out.jpeg", base64Data, 'base64', function (err) {
        getColors(path.join(__dirname, 'out.jpeg'), options).then(colors => {
            hslValuesArray = colors.map(color => color.hsl())
            for (let i = 0; i < hslValuesArray.length; i++) {
                getNotes(hslValuesArray[i])
            }
            res.json({ notes })
        })
    });
})

server.get("/getnotes", (req, res) => {
    res.json({ notes })
})


server.listen("5000", () => { console.log(`Server running at http://localhost:5000`) })
