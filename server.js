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
app.get('/gigs/stats/agencies/:agencyId', gigs.agencystats)
app.get('/gigs/venue/:venueId', gigs.venue)
app.get('/gigs/:id', gigs.getOne)
app.post('/gigs/new', gigs.new)
app.put('/gigs/update/:id', gigs.update)
app.delete('/gigs/delete/:id', gigs.delete)


// ? Agencies
app.get('/agencies', agencies.getAll)
app.get('/agencies/names', agencies.names)
app.get('/agencies/:id', agencies.getOne)
app.post('/agencies/new', agencies.new)
app.put('/agencies/update/:id', agencies.update)
app.delete('/agencies/delete/:id', agencies.delete)

// ? Venues
app.get('/venues', venues.getAll)
app.get('/venues/names', venues.names)
app.get('/venues/:id', venues.getOne)
app.post('/venues/new', venues.new)