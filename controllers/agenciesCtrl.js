const Agency = require('../config/models/agencies')
const Gig = require('../config/models/gigs')
const { default: mongoose } = require('mongoose')

// Get all
async function getAll(req, res) {
    try {
        const agencies = await Agency
            .find({}, { _id: 1, name: 1 })
            .sort('name')
            .lean()
        return res.status(200).json(agencies)
    } catch (err) {
        console.error(err)
        return res.status(400).json( { error: 'Something went wrong' })
    }
}

// Get one
async function getOne(req, res) {
    try {
        const id = req.params.id
        const objectId = new mongoose.Types.ObjectId(id)
        const agency = await Agency.findById(id).lean()
        const gigs = await Gig
            .find( { agencyId: id } )
            .sort('-date')
            .lean()
        const stats = await Gig.aggregate([
            { $match: { agencyId: objectId } },
            { $group: { 
                _id: null, 
                totalEarnings: { $sum: "$fee" },
                gigCount: { $sum: 1 }
            }},
        ])
        if (stats.length === 0) {
            stats.push({
                gigCount: 0,
                totalEarnings: 0
            })
        }
        const data = {
            gigs: gigs,
            agency: agency,
            stats: stats
        }
        return res.status(200).json(data)
    } catch (err) {
        console.error(err)
        return res.status(400).json({ message: 'Something has gone wrong' })
    }
}

// Create new agency
async function createNew(req, res) {
    try {
        const newAgency = new Agency(req.body)
        const agencyExists = await Agency.findOne( { name: newAgency.name} )
        if (agencyExists) { 
            return res.status(400).json({ error: 'Cannot add agent: Agent already exists' })
        }
        newAgency.initials = agencyInitials(newAgency.name)
        let save = await newAgency.save()
        return res.status(201).json(save)
    } catch (err) {
        console.error(err.message)
        return res.status(400).json({ error: 'Something went wrong'})
    }
}

// Work out the agency's intials (for avatar)
function agencyInitials(name) {
        let nameArr = name.split(' ')
        let initialsArr = nameArr.map(word => word.charAt(0))
        return initialsArr.join('')
    }

// Update Agency
async function updateAgency(req, res) {
    try {
        const id = req.params.id
        const body = req.body
        const updated = await Agency.findByIdAndUpdate(id, body)
        updated.initials = agencyInitials(body.name)
        await updated.save()
        return res.status(201).json(updated)
    } catch (error) {
        console.error(error.message)
        return res.status(400).json({ message: 'Something went wrong'})
    }
}

// Delete Agency
async function deleteAgency(req, res) {
    try {
        const id = req.params.id
        const agency = await Agency.findByIdAndDelete(id)
        return res.status(200).json({ message: 'The agency was deleted' })
    } catch (err) {
        console.error(err)
        return res.status(404).json({ message: 'The agency was not deleted' })
    }
}

module.exports = {
    new: createNew,
    getOne: getOne,
    getAll: getAll,
    update: updateAgency,
    delete: deleteAgency
}