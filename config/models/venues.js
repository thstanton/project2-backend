const mongoose = require('mongoose')
const Schema = mongoose.Schema

const venueSchema = new Schema({
    name: String,
    address: String,
    postcode: String
}, {
    timestamps: true
})

const Venue = mongoose.model('Venue', venueSchema)
module.exports = Venue