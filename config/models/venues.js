import mongoose from "mongoose"
const Schema = mongoose.Schema

const venueSchema = new Schema({
    name: String,
    address: String,
    postcode: String,
    userId: Schema.Types.ObjectId,
    geoData: {
        lat: Number,
        lng: Number
    }
}, {
    timestamps: true
})

export const Venue = mongoose.model('Venue', venueSchema)