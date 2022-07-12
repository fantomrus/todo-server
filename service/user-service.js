const UserModel = require('../models/user-model')
const TodoModel = require('../models/todo-model')
const UserRoleModel = require('../models/user-role-model')

const tokenService = require('../service/token-service')
const ApiErrors = require('../exeptions/api-error')
const bcrypt = require('bcrypt')
const UserDto = require('../dtos/user-dto')

const resultUser = async(user) => {
    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return {...tokens, user: userDto}
}

class UserService {
    async registration(firstName, lastName, patronymic, login, password) {
        const candidate = await UserModel.findOne({login})
        if (candidate) {
            throw ApiErrors.BadRequest(`Пользователь с логином ${login} уже зарегистрирован`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const userRole = await UserRoleModel.findOne({value: 'User'})
        const user = await UserModel.create({firstName, lastName, patronymic, login, password: hashPassword, role: userRole.value})
        return resultUser(user)
    }
    async addRole(value){
        const candidate = await UserRoleModel.findOne({value})
        if (candidate) {
            throw ApiErrors.BadRequest(`Роль ${value} уже существует`)
        }
        return await UserRoleModel.create({value})
    }
    async login(login, password) {
        const user = await UserModel.findOne({login})
        if (!user) {
            throw ApiErrors.BadRequest(`Пользователь с логином ${login} не найден`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiErrors.BadRequest(`Введен неверный пароль`)
        }
        return resultUser(user)
    }
    async logout(refreshToken) {
        return tokenService.removeToken(refreshToken)
    }
    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiErrors.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDB) {
            throw ApiErrors.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        return resultUser(user)
    }
    async getAllUsers() {
        return UserModel.find()
    }
    async getUsersTodo() {
        const todo = await TodoModel.find()
        return [...new Set(todo.map(item => {return item.userResponsible}))]
    }
}


module.exports = new UserService()