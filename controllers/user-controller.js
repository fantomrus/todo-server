const userService = require('../service/user-service')
const { validationResult } = require('express-validator')
const ApiErrors = require('../exeptions/api-error')

class UserController {
    async registration(request, response, next) {
        try{
            const errors = validationResult(request)
            if(!errors.isEmpty()) {
                return next(ApiErrors.BadRequest("Ошибка при валидации", errors.array()))
            }
            const {firstName, lastName, patronymic, login, password, role} = request.body
            const userData = await userService.registration(firstName, lastName, patronymic, login, password, role)
            response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return response.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async login(request, response, next) {
        try{
            const {login, password} = request.body
            const userData = await userService.login(login, password)
            response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return response.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async logout(request, response, next) {
        try {
            const {refreshToken} = request.cookies

            await userService.logout(refreshToken)
            response.clearCookie('refreshToken')
            return response.status(200).json({message:"Вы успешно вышли из аккаунта"})
        }
         catch (e) {
            next(e)
        }
    }
    async refresh(request, response, next) {
        try{
            const {refreshToken} = request.cookies
            const userData = await userService.refresh(refreshToken)
            response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return response.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async addRole(request, response, next) {
        try{
            const {value} = request.body
            const role = await userService.addRole(value)
            return response.json(role)
        } catch (e) {
            next(e)
        }
    }
    async getAllUsers(request, response, next) {
        try{
            const users = await userService.getAllUsers()
            return response.json(users)
        } catch (e) {
            next(e)
        }
    }
    async getUsersTodo(request, response, next) {
        try{
            const users = await userService.getUsersTodo()
            return response.json(users)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()