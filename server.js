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
app.get('/gigs/status/:status', gigs.status)
app.get('/gigs/agency/:agencyId', gigs.agency)
app.get('/gigs/venue/:venueId', gigs.venue)
app.get('/gigs/:id', gigs.getOne)
app.post('/gigs/new', gigs.new)

// ? Agencies
app.get('/agencies', agencies.getAll)
app.get('/agencies/names', agencies.names)
app.get('/agencies/:id', agencies.getOne)
app.post('/agencies/new', agencies.new)

// ? Venues
app.get('/venues', venues.getAll)
app.get('/venues/names', venues.names)
app.get('/venues/:id', venues.getOne)
app.post('/venues/new', venues.new)