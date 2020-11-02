var app = require('express')()
var dotenv = require('dotenv').config().parsed
var cors = require('cors');
var request = require('request');


app.get('/api/job-search', (req, res, next) => {
    if (req.query.key) {
        if (req.query.key === dotenv.API_KEY) {
            next()
        } else {
            res.status('403')
            res.json({ status: 403, message: 'INCORRECT_API_KEY' })
        }
    } else {
        res.status('400')
        res.json({ status: 400, message: 'NO_API_KEY_PROVIDED' })
    }
}, (req, res, next) => {
    if (req.query.cat) {
        req.reqUri = `https://www.themuse.com/api/public/jobs?api_key=${dotenv.MUSE_API_KEY}&page=1&category=${req.query.cat}`
    } else {
        req.reqUri = `https://www.themuse.com/api/public/jobs?api_key=${dotenv.MUSE_API_KEY}&page=1`
    }
    next()
}, (req, res, next) => {
    request(req.reqUri, (err, data) => {
        if (err) {
            res.json({ err: err })
        } else {
            res.json(JSON.parse(data.body))
        }
    })
})


const port = process.env.PORT || 8080
app.listen(port, () => { console.log(`node listening on port ${port}`); })

