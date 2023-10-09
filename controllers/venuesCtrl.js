const Venue = require('../config/models/venues')

// Create new agency
async function createNew(req, res) {
    try {
        const newVenue = new Venue(req.body)
        if (Venue.findOne( { name: newVenue.name} )) return res.status(400).json({ error: 'Cannot add venue: Venue already exists' })
        let save = await newVenue.save()
        console.log(save)
        return res.status(201).json(save)
    } catch (err) {
        console.error(error.message)
        return res.status(400).json({ error: 'Something went wrong'})
    }
}

module.exports = {
    new: createNew
}