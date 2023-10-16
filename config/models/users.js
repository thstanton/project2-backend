import mongoose from "mongoose"
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        required: true
    },
}, {
    timestamps: true
})

export const User = mongoose.model('User', userSchema)