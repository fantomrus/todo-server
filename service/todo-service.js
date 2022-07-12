const TodoModel = require('../models/todo-model')
const TodoStatusModel = require('../models/todo-status-model')
const TodoPriorityModel = require('../models/todo-priority-model')
const ApiErrors = require('../exeptions/api-error')
const TokenService = require('../service/token-service')
const UserModel = require('../models/user-model')

class TodoService {
    async addTodo(title, description, dateCompletion, priority, userResponsible, refreshToken) {
        const todoStatus = await TodoStatusModel.findOne({value: 'Execution'})
        const {_id} = await TokenService.findToken(refreshToken)
        const user = await UserModel.findOne(_id)
        return TodoModel.create({
            title,
            description,
            dateCompletion,
            priority,
            status: todoStatus.value,
            userCreator: user.login,
            userResponsible
        })
    }

    async newStatus(value) {
        const candidate = await TodoStatusModel.findOne({value})
        if (candidate) {
            throw ApiErrors.BadRequest(`Статус "${value}" уже существует`)
        }
        return await TodoStatusModel.create({value})
    }

    async newPriority(value) {
        const candidate = await TodoPriorityModel.findOne({value})
        if (candidate) {
            throw ApiErrors.BadRequest(`Приоритет "${value}" уже существует`)
        }
        return await TodoPriorityModel.create({value})
    }

    async updateTodo(id, title, description, dateCompletion, priority, status, userCreator, userResponsible) {
        return TodoModel.findOneAndUpdate({_id: id}, {
            title,
            description,
            dateCompletion,
            priority,
            status,
            userCreator,
            userResponsible
        }, {upsert: true})
    }

    async getAllTodo() {
        return TodoModel.find()
    }

    async getTodoUser(login) {
        if(login === 'allUsers') {
            return TodoModel.find()
        }
        const todo = TodoModel.find({userResponsible: login})
        if (!todo) {
            throw ApiErrors.BadRequest(`Задачи пользователя не найдены`)
        }
        return todo
    }

    async filterDateTodo(todo, date) {
        const today = new Date().setHours(0, 0, 0,0)
        if (date === 'allDate') {
            return todo
        }
        if (date === 'today') {
            return todo.filter(item => {
                const itemTime = new Date(item.dateCompletion).setHours(0, 0, 0, 0)
                return itemTime === today
            })
        }
        if (date === 'week') {
            return todo.filter(item => {
                const endDate =  today + (7 * 24 * 60 * 60 * 1000);
                const itemTime = new Date(item.dateCompletion).setHours(0, 0, 0, 0)
                return itemTime >= today && itemTime <= endDate
            })
        }
        if (date === 'future') {
            return todo.filter(item => {
                const itemTime = new Date(item.dateCompletion).setHours(0, 0, 0, 0)
                return itemTime >= today
            })
        }
    }

    async getAllPriority() {
        return TodoPriorityModel.find()
    }

    async getAllStatus() {
        return TodoStatusModel.find()
    }
}

module.exports = new TodoService()