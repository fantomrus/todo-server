const jwt = require("jsonwebtoken")
const UserTokenModel = require("../models/user-token-model")
class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await UserTokenModel.findOne({user: userId})
        if(tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        return await UserTokenModel.create({userId, refreshToken})
    }
    async removeToken(refreshToken) {
        return UserTokenModel.deleteOne({refreshToken})
    }
    validateAccessToken(token) {
        try{
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        } catch (e) {
            return null
        }
    }
    validateRefreshToken(token) {
        try{
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        } catch (e) {
            return null
        }
    }
    async findToken(refreshToken) {
        return UserTokenModel.findOne({refreshToken})
    }
}
module.exports = new TokenService()