const Venue = require('../config/models/venues')

// Create new
async function createNew(req, res) {
    try {
        const newVenue = new Venue(req.body)
        const venueExists = await Venue.findOne( { name: newVenue.name } )
        if (venueExists) return res.status(400).json({ error: 'Cannot add venue: Venue already exists' })
        let save = await newVenue.save()
        console.log(save)
        return res.status(201).json(save)
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ error: 'Something went wrong'})
    }
}

// Get all
async function getAll(req, res) {
    try {
        const venues = await Venue
            .find({}, { _id: 1, name: 1 })
            .sort('name')
            .lean()
        return res.status(200).json(venues)
    } catch (err) {
        console.error(err)
        return res.status(400).json( { error: 'Something went wrong' })
    }
}

// Get one
async function getOne(req, res) {
    try {
        const id = req.params.id
        const venue = await Venue.findById(id).lean()
        console.log(venue)
        return res.status(200).json(venue)
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

module.exports = {
    new: createNew,
    getOne: getOne,
    getAll: getAll,
    delete: deleteVenue,
    update: updateVenue
}