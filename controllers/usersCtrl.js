import { User } from '../config/models/users.js'
import jwt from 'jsonwebtoken'

// ? User
async function userController(req, res) {
    const reqUser = req.body
    const user = await User.findOne({ email: reqUser.email })
    const date = new Date()
    if (user) {
        await user.updateOne({ lastLogin: date })
        user.save()
        .then(() => {
            res.sendStatus(200)
        })
        .catch(error => {
            res.sendStatus(error)
        })
    } else {
        const newUser = new User({
            email: reqUser.email,
            lastLogin: date
        })
        newUser.save()
        .then(() => {
            res.sendStatus(200)
        })
        .catch(error => {
            res.sendStatus(error)
        })
    }
}

export const users = {
    controller: userController
}

export async function getUser(token) {
    const payload = token.split(' ')[1]
    const decodedToken = jwt.decode(payload)
    const email = decodedToken.email
    const userId = await User.findOne({ email: email }, '_id')
    return userId
}