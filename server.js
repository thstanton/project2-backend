// ! Import node modules
const cors = require('cors')
const bodyParser = require('body-parser')
require('./config/database')

// ! Initialise express
const express = require('express')
const app = express()
app.listen(4000)
app.use(cors())
app.use(bodyParser.json())

// ! Import Controllers
const gigs = require('./controllers/gigsCtrl')
const venues = require('./controllers/venuesCtrl')
const agencies = require('./controllers/agenciesCtrl')
const users = require('./controllers/usersCtrl')

// ! Endpoints
app.get('/', function (req, res) {
    res.send('Hello World')
  })

app.get('/gigs', gigs.getAll)