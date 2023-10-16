import express, { Router } from "express"
import serverless from "serverless-http"
import cors from "cors"
import 'dotenv/config'
import bodyParser from "body-parser"

const api = express()
api.use(cors())
api.use(bodyParser.json())


const router = Router()
router.get("/hello", (req, res) => res.send("Hello World!"))

// ! Import Controllers
import { gigs } from "../../controllers/gigsCtrl"
import { venues } from "../../controllers/venuesCtrl"
import { agencies } from "../../controllers/agenciesCtrl"
import { users } from "../../controllers/usersCtrl"

// ! Endpoints
// ? Gigs
router.get('/gigs', gigs.getAll)
router.get('/gigs/upcoming', gigs.upcoming)
router.get('/gigs/populate-form', gigs.populateForm)
router.get('/gigs/populate-form/:id', gigs.populateForm)
router.get('/gigs/status/:status', gigs.status)
router.get('/gigs/agency/:agencyId', gigs.agency)
router.get('/gigs/stats/agencies', gigs.agencystats)
router.get('/gigs/stats/agencies/:agencyId', gigs.agencystats)
router.get('/gigs/venue/:venueId', gigs.venue)
router.get('/gigs/:id', gigs.getOne)
router.post('/gigs/new', gigs.new)
router.put('/gigs/update/:id', gigs.update)
router.delete('/gigs/delete/:id', gigs.delete)

// ? Agencies
router.get('/agencies', agencies.getAll)
router.get('/agencies/:id', agencies.getOne)
router.post('/agencies/new', agencies.new)
router.put('/agencies/update/:id', agencies.update)
router.delete('/agencies/delete/:id', agencies.delete)

// ? Venues
router.get('/venues', venues.getAll)
router.post('/venues/new', venues.new)
router.get('/venues/locations', venues.locations)
router.put('/venues/update/:id', venues.update)
router.delete('/venues/delete/:id', venues.delete)
router.get('/venues/:id', venues.getOne)

// ? User
router.post('/users', users.controller)

api.use("/api/", router)

export const handler = serverless(api)