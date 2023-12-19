import { Venue } from '../config/models/venues.js'
import { Gig } from '../config/models/gigs.js'
import mongoose from 'mongoose'
import { getUser } from './usersCtrl.js'
const GOOGLE_API = 'https://maps.googleapis.com/maps/api/geocode/json'

// Create new
async function createNew(req, res) {
    try {
        const userId = new mongoose.Types.ObjectId(await getUser(req.headers.authorization))
        const newVenue = new Venue(req.body.venue)
        const venueExists = await Venue.findOne( { name: newVenue.name, userId: userId } )
        if (venueExists) return res.status(400).json({ error: 'Cannot add venue: Venue already exists' })
        newVenue.geoData = await getLocationData(newVenue.postcode)
        newVenue.userId = userId
        await newVenue.save()
        console.log(newVenue)
        return res.status(201).json(newVenue)
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ error: 'Something went wrong'})
    }
}

// Get all
async function getAll(req, res) {
    try {
        const userId = new mongoose.Types.ObjectId(await getUser(req.headers.authorization))
        const venues = await Venue
            .find({ userId: userId }, { _id: 1, name: 1 })
            .sort('name')
            .lean()
        return res.status(200).json(venues)
    } catch (err) {
        console.error(err)
        return res.status(400).json( { error: 'Something went wrong' })
    }
}

async function getLocationData(postcode) {
    try {
        const encodedPostcode = encodeURIComponent(postcode)
        const locationData = await fetch(`${GOOGLE_API}?address=${encodedPostcode}&key=${process.env.GOOGLE_MAPS_API_KEY}`)
        const json = await locationData.json()
        console.log(json)
        return json.results[0].geometry.location
    } catch (error) {
        console.error(error)
    }
}

// Get all location data
async function getAllLocationData(req, res) {
    try {
        const userId = new mongoose.Types.ObjectId(await getUser(req.headers.authorization))
        const venues = await Venue
            .find({ userId: userId })
            .lean()
        console.log(venues)
        return res.status(200).json(venues)
    } catch (err) {
        console.error(err)
        return res.status(400).json({ message: 'Something has gone wrong' })
    }
}

// Get one
async function getOne(req, res) {
    try {
        const id = req.params.id
        const venue = await Venue.findById(id).lean()
        const gigs = await Gig
            .find( { venueId: id } )
            .sort('-date')
            .lean()
        const data = { venue: venue, gigs: gigs }
        return res.status(200).json(data)
    } catch (err) {
        console.error(err)
        return res.status(400).json({ message: 'Something has gone wrong' })
    }
}

// Update Venue
async function updateVenue(req, res) {
    try {
        const id = req.params.id
        const body = req.body
        const updated = await Venue.findByIdAndUpdate(id, body)
        return res.status(201).json(updated)
    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: 'Something went wrong'})
    }
}

// Delete Venue
async function deleteVenue(req, res) {
    try {
        const id = req.params.id
        const agency = await Venue.findByIdAndDelete(id)
        return res.status(200).json({ message: 'The venue was deleted' })
    } catch (err) {
        console.error(err)
        return res.status(404).json({ message: 'The venue was not deleted' })
    }
}

export const venues = {
    new: createNew,
    getOne: getOne,
    getAll: getAll,
    delete: deleteVenue,
    update: updateVenue,
    locations: getAllLocationData
}