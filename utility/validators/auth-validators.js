const {body} = require("express-validator");

const registrationValidate = [
    body('firstName').isLength({min: 2}),
    body('lastName').isLength({min: 3}),
    body('login').isLength({min: 6, max: 32}),
    body('password').isLength({min: 6, max: 32})
]
module.exports = {
    registrationValidate
}