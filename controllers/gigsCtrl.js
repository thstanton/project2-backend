const Gig = require('../config/models/gigs')
const Agency = require('../config/models/agencies')
const Venue = require('../config/models/venues')
const { default: mongoose } = require('mongoose')
const moment = require('moment')

// Get all gigs
async function getAll(req, res) {
    try { 
        const allGigs = await Gig.find({}).lean()
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

// Get stats by agency
async function getAgencyStats(req, res) {
    try {
        const id = req.params.agencyId
        const objectId = new mongoose.Types.ObjectId(id)
        const stats = await Gig.aggregate([
            { $match: { agencyId: objectId } },
            { $group: { 
                _id: null, 
                totalEarnings: { $sum: "$fee" },
                gigCount: { $sum: 1 }
            }},
        ])
        return res.status(200).json(stats)
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
        const agency = await Agency.findOne({ _id: gig.agencyId }).lean()
        const venue = await Venue.findOne({ _id: gig.venueId }).lean()
        const data = { gig: gig, agency: agency, venue: venue }
        return res.status(200).json(data)
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

// Delete gig
async function deleteGig(req, res) {
    try {
        const id = req.params.id
        const gig = await Gig.findByIdAndDelete(id)
        return res.status(200).json({ message: 'The gig was deleted' })
    } catch (err) {
        console.error(err)
        return res.status(404).json({ message: 'The gig was not deleted' })
    }
}

// Update Gig
async function updateGig(req, res) {
    try {
        const id = req.params.id
        const body = req.body
        const updatedGig = await Gig.findByIdAndUpdate(id, body)
        return res.status(201).json(updatedGig)
    } catch (error) {
        console.error(error.message)
        return res.status(400).json({ message: 'Something went wrong'})
    }
}

// Agency and Venue Names for New Gig Form
async function populateGigForm(req, res) {
    try {
        const agencyNames = await Agency.find({}, { _id: 0, name: 1 }).lean()
        const agencyNamesArr = agencyNames.map(agency => agency.name)
        const venueNames = await Venue.find({}, { _id: 0, name: 1 }).lean()
        const venueNamesArr = venueNames.map(venue => venue.name)
        const data = { venues: venueNamesArr, agencies: agencyNamesArr }
        if (req.params.id) {
            const id = req.params.id
            const gigData = await Gig.findById(id).lean()
            data.gig = gigData
        }
        return res.status(201).json(data)
    } catch (error) {
        console.error(error.message)
        return res.status(400).json({ message: 'Something went wrong'})
    }
}

//Upcoming Gigs
async function getUpcoming(req, res) {
    try {
        // const test = await Gig.find({ date: new Date('20 Oct 23')})
        const today = new Date()
        // const data = await Gig.find({ date: {$gte:today} })
        const data = await Gig.aggregate([
            { $match: { date: { $gte: today }}}
        ])
        return res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ message: 'Something went wrong'})
    }
}

module.exports = {
    status: filterStatus,
    agency: filterAgency,
    venue: filterVenue,
    agencystats: getAgencyStats,
    getOne: getOne,
    new: createNew,
    getAll: getAll,
    delete: deleteGig,
    update: updateGig,
    populateForm: populateGigForm,
    upcoming: getUpcoming
}