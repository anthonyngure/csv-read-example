const csv = require('csv-parser')
const fs = require('fs')
const start = Date.now()
const items = []
let totalOfIds = 0
fs.createReadStream('data.csv', {})
    .pipe(csv())
    .on('data', chunk => {
        items.push(chunk)
        totalOfIds += parseInt(chunk.id)
    })
    .on('error', err => {
        console.log(err)
    })
    .on('end', () => {
        const now = Date.now()
        const tat = now - start
        console.log(`Sum of IDs ${totalOfIds}`)
        console.log(`Items count  ${items.length}`)
        console.log(`${tat} millis`)
    })
