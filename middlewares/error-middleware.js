const ApiErrors = require('../exeptions/api-error')

module.exports = function (errors, request, response, next) {
    console.log(errors)
    if(errors instanceof ApiErrors) {
        return response.status(errors.status).json({message: errors.message, errors: errors.errors})
    }
    return response.status(500).json({message: 'Непредвиденная ошибка'})
}