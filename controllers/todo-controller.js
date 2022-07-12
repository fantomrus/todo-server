const todoService = require('../service/todo-service')
const { validationResult } = require('express-validator')
const ApiErrors = require('../exeptions/api-error')

class todoController {
    async getAllTodo(request, response, next) {
        try{
            if (request.query.user) {
                const todo = await todoService.getTodoUser(request.query.user)
                if(request.query.date) {
                    const filter = await todoService.filterDateTodo(todo, request.query.date)
                    return response.json(filter)
                }
                return response.json(todo)
            }
            if(request.query.date && !request.query.user) {
                const todo = await todoService.getTodoUser('allUsers')
                const filter = await todoService.filterDateTodo(todo, request.query.date)
                return response.json(filter)
            }
            const todo = await todoService.getAllTodo()
            return response.json(todo)
        } catch (e) {
            next(e)
        }
    }
    async getAllPriority(request, response, next) {
        try{
            const todo = await todoService.getAllPriority()
            return response.json(todo)
        } catch (e) {
            next(e)
        }
    }
    async getAllStatus(request, response, next) {
        try{
            const todo = await todoService.getAllStatus()
            return response.json(todo)
        } catch (e) {
            next(e)
        }
    }
    async addTodo(request, response, next) {
        const errors = validationResult(request)
        if(!errors.isEmpty()) {
            return next(ApiErrors.BadRequest("Ошибка при валидации", errors.array()))
        }
        try{
            const {refreshToken} = request.cookies
            const {title, description, dateCompletion, priority, userResponsible} = request.body
            const todoData = await todoService.addTodo(title, description, dateCompletion, priority, userResponsible, refreshToken)
            return response.json(todoData)
        } catch (e) {
            next(e)
        }
    }
    async updateTodo(request, response, next) {
        try{
            const {id, title, description, dateCompletion, priority, status, userCreator, userResponsible} = request.body
            await todoService.updateTodo(id, title, description, dateCompletion, priority, status, userCreator, userResponsible)
            return response.status(200).json({message: "успешно"})
        } catch (e) {
            next(e)
        }
    }
    async newStatus(request, response, next) {
        try{
            const {value} = request.body
            const status = await todoService.newStatus(value)
            return response.json(status)
        } catch (e) {
            next(e)
        }
    }
    async newPriority(request, response, next) {
        try{
            const {value} = request.body
            const priority = await todoService.newPriority(value)
            return response.json(priority)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new todoController()