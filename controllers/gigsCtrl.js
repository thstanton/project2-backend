import { Gig } from '../config/models/gigs.js'
import { Agency } from '../config/models/agencies.js'
import { Venue } from '../config/models/venues.js'
import { User } from '../config/models/users.js'
import mongoose from 'mongoose'
import { getUser } from './usersCtrl.js'

// Get all gigs
async function getAll(req, res) {
    try {
        const userId = await getUser(req.headers.authorization)
        const allGigs = await Gig.find({ userId: userId })
        .sort('-date')
        .lean()
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
        const userId = new mongoose.Types.ObjectId(await getUser(req.headers.authorization))
        const status = req.params.status
        const gigs = await Gig
            .find( { status: status, userId: userId } )
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
        let stats
        if (id) {
            const objectId = new mongoose.Types.ObjectId(id)
            stats = await Gig.aggregate([
                { $match: { agencyId: objectId } },
                { $group: { 
                    _id: null, 
                    totalEarnings: { $sum: "$fee" },
                    gigCount: { $sum: 1 }
                }}
            ])             
        } else {
            const userId = new mongoose.Types.ObjectId(await getUser(req.headers.authorization))
            // Get aggregate agency data
            const data = await Gig.aggregate([
                { $match: { userId: userId }},
                { $group: { 
                    _id: "$agencyId", 
                    totalEarnings: { $sum: "$fee" },
                    gigCount: { $sum: 1 }
                }}
            ])
            // Associate Agency name with Id
            const agencyNames = await Agency.find({}, { name: 1 }).lean()
            data.forEach((agency) => {
                for (let item of agencyNames) {
                    console.log(item._id.toString())
                    if (item._id.toString() === agency._id.toString()) agency.name = item.name
                }
            })

            // stats = { gigData, agencyNamesArr }

            // Format data for ChartJS
            stats = {
                labels: data.map(agency => agency.name),
                datasets: [{
                    label: 'Earnings',
                    data: data.map(agency => agency.totalEarnings),
                    backgroundColor: [
                        '#03A9F4',
                        '#E1F5FE',
                        '#B3E5FC',
                        '#81D4FA',
                        '#4FC3F7',
                        '#29B6F6',
                        '#039BE5',
                        '#0288D1',
                        '#0277BD',
                        '#01579B'
                    ],
                    hoverOffset: 4
                }]
            }
        }
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
        const newGig = new Gig(req.body.gig)
        // Add agency and venue Ids
        let agencyId = await Agency.findOne({ name: newGig.agencyName }, '_id')
        let venueId = await Venue.findOne({ name: newGig.venueName }, '_id')
        let userId = await User.findOne({ email: req.body.user }, '_id')
        newGig.agencyId = agencyId
        newGig.venueId = venueId
        newGig.userId = userId
        // Save
        await newGig.save()
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
        const userId = new mongoose.Types.ObjectId(await getUser(req.headers.authorization))
        const agencyNames = await Agency.find({ userId: userId }, { _id: 0, name: 1 }).lean()
        const agencyNamesArr = agencyNames.map(agency => agency.name)
        const venueNames = await Venue.find({ userId: userId }, { _id: 0, name: 1 }).lean()
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
        // Establish dates
        const oneDay = ( 1000 * 60 * 60 * 24 )
        const today = new Date()
        const thisWeek = new Date(today.valueOf() + (7 * oneDay))
        const nextWeek = new Date(today.valueOf() + (14 * oneDay))
        const month = new Date(today.valueOf() + (30 * oneDay))
        const year = new Date(today.valueOf() + (365 * oneDay))
        const newYear = new Date(today.valueOf() + (80 * oneDay))

        // Establish user
        const userId = new mongoose.Types.ObjectId(await getUser(req.headers.authorization))

        // Get gigs gte to today, then put them in buckets
        const data = await Gig.aggregate([
            { $match: { userId: userId }},
            { $match: { date: { $gte: today }}},
            { $bucket: {
                groupBy: "$date",
                boundaries: [today, thisWeek, nextWeek, month, newYear, year],
                default: "Other",
                output: {
                    gigs: {
                        $push: "$$ROOT"
                    },
                    count: { $sum: 1 }
                }
            }}
        ])
        console.log(data)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ message: 'Something went wrong'})
    }
}

export const gigs = {
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