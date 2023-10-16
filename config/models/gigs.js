import mongoose from "mongoose"
const Schema = mongoose.Schema

const gigSchema = new Schema({
    gigType: String,
    date: Date,
    startTime: String,
    endTime: String,
    agencyName: String,
    agencyId: Schema.Types.ObjectId,
    venueName: String,
    venueId: Schema.Types.ObjectId,
    lineUp: String,
    gigSets: [{
        length: Number,
        desc: String
    }],
    notes: String,
    fee: Number,
    genres: [],
    requests: [{
        name: String,
        desc: String
    }],
    status: String
}, {
    timestamps: true
})

export const Gig = mongoose.model('Gig', gigSchema)