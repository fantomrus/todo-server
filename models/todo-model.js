const {Schema, model} = require("mongoose")

const TodoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateCompletion: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        ref: 'PriorityTodo',
        required: true
    },
    status: {
        type: String,
        ref: 'StatusTodo',
        required: true
    },
    userCreator: {
        type: String,
        ref: 'User',
        required: true
    },
    userResponsible: {
        type: String,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})
module.exports = model('Todo', TodoSchema)