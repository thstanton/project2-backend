const Agency = require('../config/models/agencies')

// Get Agency Names
async function getNames(req, res) {
    try {
        const names = await Agency.find({}, { _id: 0, name: 1 }).lean()
        const namesArr = names.map(agency => agency.name)
        return res.json(namesArr)
    } catch (err) {
        console.error(err)
    }
}

// Create new agency
async function createNew(req, res) {
    try {
        const newAgency = new Agency(req.body)
        if (Agency.findOne( { name: newAgency.name} )) return res.status(400).json({ error: 'Cannot add agent: Agent already exists' })
        let save = await newAgency.save()
        console.log(save)
        return res.status(201).json(save)
    } catch (err) {
        console.error(error.message)
        return res.status(400).json({ error: 'Something went wrong'})
    }
}

module.exports = {
    new: createNew,
    names: getNames
}