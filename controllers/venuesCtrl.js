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

// Get names
async function getNames(req, res) {
    try {
        const names = await Venue.find({}, { _id: 0, name: 1 }).lean()
        const namesArr = names.map(venue => venue.name)
        return res.json(namesArr)
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    new: createNew,
    names: getNames
}