// ! Import node modules
import cors from 'cors'
import bodyParser from 'body-parser'
import './config/database.js'

// ! Initialise express
import express from 'express'
const api = express()
api.use(bodyParser.json())
api.use(cors())
api.listen(4000)

api.get("/hello", (req, res) => res.send("Hello World!"))

// ! Import Controllers
import { gigs } from './controllers/gigsCtrl.js'
import { venues } from "./controllers/venuesCtrl.js"
import { agencies } from "./controllers/agenciesCtrl.js"
import { users } from "./controllers/usersCtrl.js"

// ! Endpoints
// ? Gigs
api.get('/gigs', gigs.getAll)
api.get('/gigs/populate-form', gigs.populateForm)
api.get('/gigs/upcoming', gigs.upcoming)
api.get('/gigs/populate-form/:id', gigs.populateForm)
api.get('/gigs/status/:status', gigs.status)
api.get('/gigs/agency/:agencyId', gigs.agency)
api.get('/gigs/stats/agencies', gigs.agencystats)
api.get('/gigs/stats/agencies/:agencyId', gigs.agencystats)
api.get('/gigs/venue/:venueId', gigs.venue)
api.get('/gigs/:id', gigs.getOne)
api.post('/gigs/new', gigs.new)
api.put('/gigs/update/:id', gigs.update)
api.delete('/gigs/delete/:id', gigs.delete)


// ? Agencies
api.get('/agencies', agencies.getAll)
api.get('/agencies/:id', agencies.getOne)
api.post('/agencies/new', agencies.new)
api.put('/agencies/update/:id', agencies.update)
api.delete('/agencies/delete/:id', agencies.delete)

// ? Venues
api.get('/venues', venues.getAll)
api.post('/venues/new', venues.new)
api.get('/venues/locations', venues.locations)
api.put('/venues/update/:id', venues.update)
api.delete('/venues/delete/:id', venues.delete)
api.get('/venues/:id', venues.getOne)

// ? User
api.post('/users', users.controller)

