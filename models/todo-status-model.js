const {Schema, model} = require("mongoose")

const StatusTodoSchema = new Schema({
    value: {
        type: String,
        unique: true,
        default: 'К выполнению'
    }
})
module.exports = model('TodoStatus', StatusTodoSchema)