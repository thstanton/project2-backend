const Gig = require('../config/models/gigs')

require('../config/models/gigs')

async function getAll(req, res) {
    try { 
        const allGigs = await Gig.find()
        res.json(allGigs)
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    getAll: getAll
}