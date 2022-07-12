const ApiError = require('../exeptions/api-error')
const tokenService = require('../service/token-service')
module.exports = function (request, response, next) {
    try {
        const authorizationHeader = request.headers.authorization
        if(!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }
        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken) {
            return next(ApiError.UnauthorizedError())
        }
        const userData = tokenService.validateAccessToken(accessToken)
        if(!userData) {
            return next(ApiError.UnauthorizedError())
        }
        request.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}