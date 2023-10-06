const mongoose = require('mongoose')
const Schema = mongoose.Schema

const venueSchema = new Schema({
    name: String,
    address: String,
    postcode: String
}, {
    timestamps: true
})

module.exports = mongoose.model('Venue', venueSchema)