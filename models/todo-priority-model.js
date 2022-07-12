const {Schema, model} = require("mongoose")

const PriorityTodoSchema = new Schema({
    value: {
        type: String,
        unique: true,
        default: 'Средний'
    }
})
module.exports = model('TodoPriority', PriorityTodoSchema)