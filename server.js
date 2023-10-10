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
// ? Gigs
app.get('/gigs', gigs.getAll)
app.get('/gigs/:id', gigs.getOne)
app.post('/gigs/new', gigs.new)

// ? Agencies
app.get('/agencies/names', agencies.names)
app.post('/agencies/new', agencies.new)

// ? Venues
app.get('/venues/names', venues.names)
app.post('/venues/new', venues.new)