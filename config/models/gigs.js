const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gigSchema = new Schema({
    type: String,
    date: Date,
    startTime: Date,
    endTime: Date,
    agencyId: Schema.Types.ObjectId,
    venueId: Schema.Types.ObjectId,
    lineUp: String,
    sets: [{
        length: Number,
        description: String
    }],
    details: String,
    fee: Number,
    genre: String,
    requests: [{
        song: String,
        description: String
    }],
    status: String
}, {
    timestamps: true
})

const Gig = mongoose.model('Gig', gigSchema)
module.exports = Gig