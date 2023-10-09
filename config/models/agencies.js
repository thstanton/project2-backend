const mongoose = require('mongoose')
const Schema = mongoose.Schema

const agencySchema = new Schema({
    name: String,
    email: String
}, {
    timestamps: true
})

const Agency = mongoose.model('Agency', agencySchema)
module.exports = Agency