const csv = require('csv-parser')
const args = require('yargs/yargs')(process.argv.slice(2)).argv;
const fs = require('fs')
const moment = require('moment')
const start = Date.now()

const totals = {}
// ['BTC' => 100]
// ['ETH' => 100]

// Read this from args
const date = args.date
// console.log(date)

// Read this from args
const token = args.token
// console.log(token)

function currentTokenTotal(token) {
    // Ensure we have the token total in the totals array
    if (!totals[token]) {
        totals[token] = 0
    }
    return totals[token]
}

function collectDateAndTokenTotal(item, date, token) {
    const currentTotal = currentTokenTotal(token)
    if (matchesDate(item, date) && matchesToken(item, token) && item.transaction_type === 'DEPOSIT') {
        totals[token] = currentTotal + parseFloat(item.amount)
    } else if (matchesDate(item, date) && matchesToken(item, token) && item.transaction_type === 'WITHDRAWAL') {
        totals[token] = currentTotal - parseFloat(item.amount)
    } else {
        // The item does not match given date and token
    }
}

function collectDateTotal(item, date) {
    const token = item.token
    const currentTotal = currentTokenTotal(token)
    if (matchesDate(item, date) && item.transaction_type === 'DEPOSIT') {
        totals[token] = currentTotal + parseFloat(item.amount)
    } else if (matchesDate(item, date) && item.transaction_type === 'WITHDRAWAL') {
        totals[token] = currentTotal - parseFloat(item.amount)
    } else {
        // The item does not match given date
    }
}

function collectTokenTotal(item, token) {
    const currentTotal = currentTokenTotal(token)
    if (matchesToken(item, token) && item.transaction_type === 'DEPOSIT') {
        totals[token] = currentTotal + parseFloat(item.amount)
    } else if (matchesToken(item, token) && item.transaction_type === 'WITHDRAWAL') {
        totals[token] = currentTotal - parseFloat(item.amount)
    } else {
        // The item does not match given token
    }
}

function collectTotal(item) {
    const token = item.token
    const currentTotal = currentTokenTotal(token)
    if (item.transaction_type === 'DEPOSIT') {
        totals[token] = currentTotal + parseFloat(item.amount)
    } else if (item.transaction_type === 'WITHDRAWAL') {
        totals[token] = currentTotal - parseFloat(item.amount)
    } else {
        // The item does not match known ts type
    }
}

fs.createReadStream('transactions.csv', {})
    .pipe(csv())
    .on('data', item => {

        if (date && token) {
            // Calculate totals based on given date & token
            collectDateAndTokenTotal(item, date, token)
        } else if (date) {
            // Calculate totals based on given date only
            collectDateTotal(item, date)
        } else if (token) {
            // Calculate totals based on given token only
            collectTokenTotal(item, token)
        } else {
            // Calculate totals without any filters
            collectTotal(item)
        }

    })
    .on('error', err => {
        console.log(err)
    })
    .on('end', () => {
        console.log(totals)
        const now = Date.now()
        const tat = now - start
        console.log(`${tat / 1000} seconds`)
    })

function matchesDate(item, date) {
    // Convert item date to YYYY-MM-DD string
    const itemDate = moment.unix(item.timestamp).format('YYYY-MM-DD')
    return itemDate === date
}

function matchesToken(item, token) {
    return item.token === token
}


// Date criteria
// Token criteria

// ETC -> 450
// BTC -> 320
