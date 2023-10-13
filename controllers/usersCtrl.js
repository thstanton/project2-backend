const User = require('../config/models/users')

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

module.exports = {
    controller: userController
}