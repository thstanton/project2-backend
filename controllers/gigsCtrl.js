const Gig = require('../config/models/gigs')
const Agency = require('../config/models/agencies')
const Venue = require('../config/models/venues')

// Get all gigs
async function getAll(req, res) {
    try { 
        const allGigs = await Gig.find()
        return res.json(allGigs)
    } catch (err) {
        console.error(err)
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
        return res.status(201).json(save)
    } catch (error) {
        console.error(error.message)
        return res.status(400).json({ message: 'Something went wrong'})
    }
}

module.exports = {
    getAll: getAll,
    getOne: getOne,
    new: createNew
}