// ! Import node modules
const cors = require('cors')
const bodyParser = require('body-parser')
require('./config/database')
const serverless = require('serverless-http')

// ! Initialise express
const express = require('express')

const api = express()
const app = express.Router()
api.use(bodyParser.json())
api.use(cors())
api.use("/", app)

// ! Import Controllers
const gigs = require('./controllers/gigsCtrl')
const venues = require('./controllers/venuesCtrl')
const agencies = require('./controllers/agenciesCtrl')
const users = require('./controllers/usersCtrl')

// ! Endpoints
// ? Gigs
app.get('/gigs', gigs.getAll)
app.get('/gigs/upcoming', gigs.upcoming)
app.get('/gigs/populate-form', gigs.populateForm)
app.get('/gigs/populate-form/:id', gigs.populateForm)
app.get('/gigs/status/:status', gigs.status)
app.get('/gigs/agency/:agencyId', gigs.agency)
app.get('/gigs/stats/agencies', gigs.agencystats)
app.get('/gigs/stats/agencies/:agencyId', gigs.agencystats)
app.get('/gigs/venue/:venueId', gigs.venue)
app.get('/gigs/:id', gigs.getOne)
app.post('/gigs/new', gigs.new)
app.put('/gigs/update/:id', gigs.update)
app.delete('/gigs/delete/:id', gigs.delete)


// ? Agencies
app.get('/agencies', agencies.getAll)
app.get('/agencies/:id', agencies.getOne)
app.post('/agencies/new', agencies.new)
app.put('/agencies/update/:id', agencies.update)
app.delete('/agencies/delete/:id', agencies.delete)

// ? Venues
app.get('/venues', venues.getAll)
app.post('/venues/new', venues.new)
app.get('/venues/locations', venues.locations)
app.put('/venues/update/:id', venues.update)
app.delete('/venues/delete/:id', venues.delete)
app.get('/venues/:id', venues.getOne)


// ? User
app.post('/users', users.controller)

module.exports.handler = serverless(app);