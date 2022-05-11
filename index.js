const csv = require('csv-parser')
const fs = require('fs')
const start = Date.now()
const items = []
fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', chunk => {
        items.push(chunk)
        console.log(chunk.id)
    })
    .on('error', err => {
        console.log(err)
    })
    .on('end', () => {
        const now = Date.now()
        const tat = now - start
        console.log(`${tat} millis`)
    })
