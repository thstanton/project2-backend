const Gig = require('../config/models/gigs')
const Agency = require('../config/models/agencies')
const Venue = require('../config/models/venues')

// Get all gigs
async function getAll(req, res) {
    try { 
        const allGigs = await Gig.find()
        return res.status(200).json(allGigs)
    } catch (err) {
        console.error(err)
        return res.status(400).json({ error: 'Something went wrong' })
    }
}

// Get gigs filtered by venue
async function filterVenue(req, res) {
    try {
        const venueId = req.params.venueId
        const gigs = await Gig
            .find( { venueId: venueId } )
            .sort('-date')
            .lean()
        return res.status(200).json(gigs)
    } catch (err) {
        console.error(err)
        return res.status(400).json({ error: 'Something went wrong' })
    }
}

// Get gigs by status
async function filterStatus(req, res) {
    try {
        const status = req.params.status
        const gigs = await Gig
            .find( { status: status } )
            .sort('-date')
            .lean()
        return res.status(200).json(gigs)
    } catch (err) {
        console.error(err)
        return res.status(400).json({ error: 'Something went wrong' })
    }
}

// Get gigs filtered by agency
async function filterAgency(req, res) {
    try {
        const agency = req.params.agencyId 
        const gigs = await Gig
            .find( { agencyId: agency } )
            .sort('-date')
            .lean()
        return res.status(200).json(gigs)
    } catch (err) {
        console.error(err)
        return res.status(400).json({ error: 'Something went wrong' })
    }
}

// Get one gig
async function getOne(req, res) {
    try {
        const id = req.params.id
        const gig = await Gig.findById(id).lean()
        console.log(gig)
        return res.status(200).json(gig)
    } catch (err) {
        console.error(err)
        return res.status(400).json({ message: 'Something has gone wrong' })
    }
}

// Create new gig
async function createNew(req, res) {
    try {
        // Map form content to model 
        const newGig = new Gig(req.body)
        // Add agency and venue Ids
        let agencyId = await Agency.findOne({ name: newGig.agencyName }, '_id')
        let venueId = await Venue.findOne({ name: newGig.venueName}, '_id')
        newGig.agencyId = agencyId
        newGig.venueId = venueId
        // Save
        let save = await newGig.save()
        return res.status(201).json({ id: newGig._id })
    } catch (error) {
        console.error(error.message)
        return res.status(400).json({ message: 'Something went wrong'})
    }
}

module.exports = {
    status: filterStatus,
    agency: filterAgency,
    venue: filterVenue,
    getOne: getOne,
    new: createNew,
    getAll: getAll,
}