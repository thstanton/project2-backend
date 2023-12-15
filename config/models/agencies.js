import mongoose from "mongoose"
const Schema = mongoose.Schema

const agencySchema = new Schema({
    name: String,
    initials: String,
    email: String,
    userId: Schema.Types.ObjectId
}, {
    timestamps: true
})

export const Agency = mongoose.model('Agency', agencySchema)