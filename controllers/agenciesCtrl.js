const Agency = require('../config/models/agencies')

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

// Get one
async function getOne(req, res) {
    try {
        const id = req.params.id
        const agency = await Agency.findById(id).lean()
        console.log(agency)
        return res.status(200).json(agency)
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
        console.error(error.message)
        return res.status(400).json({ error: 'Something went wrong'})
    }
}

// Work out the agency's intials (for avatar)
function agencyInitials(name) {
        let nameArr = name.split(' ')
        let initialsArr = nameArr.map(word => word.charAt(0))
        return initialsArr.join('')
    }

module.exports = {
    new: createNew,
    names: getNames,
    getOne: getOne,
    getAll: getAll,
}