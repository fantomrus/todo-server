const {body} = require("express-validator");

const addTodoValidators = [
    body('title').isLength({min: 2}),
    body('description').isLength({min: 2}),
    body('dateCompletion').isString,
    body('priority').isString,
    body('userResponsible').isString,
]
module.exports = {
    addTodoValidators
}