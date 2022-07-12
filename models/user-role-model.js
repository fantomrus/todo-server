const {Schema, model} = require("mongoose")

const UserRoleSchema = new Schema({
    value: {
        type: String,
        unique: true,
        default: 'User'
    }
})
module.exports = model('UserRole', UserRoleSchema)