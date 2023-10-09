const Gig = require('../config/models/gigs')
const Agency = require('../config/models/agencies')

// Get all gigs
async function getAll(req, res) {
    try { 
        const allGigs = await Gig.find()
        res.json(allGigs)
    } catch (error) {
        console.error(error)
    }
}

// Create new gig
async function createNew(req, res) {
    try { 
        const newGig = new Gig(req.body)
        let agencyId = await Agency.findOne({ name: newGig.agencyName }, '_id')
        console.log(agencyId)
        newGig.agencyId = agencyId
        let save = await newGig.save()
        return res.status(201).json(save)
    } catch (error) {
        console.error(error.message)
        return res.status(400).json({ message: 'Something went wrong'})
    }
}

module.exports = {
    getAll: getAll,
    new: createNew
}