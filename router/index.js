const Router = require('express').Router
const userController = require('../controllers/user-controller')
const todoController = require('../controllers/todo-controller')
const {registrationValidate} = require('../utility/validators/auth-validators');
const authMiddleware = require('../middlewares/auth-middleware')
const router = new Router()

router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getAllUsers)
router.get('/users_todo',authMiddleware, userController.getUsersTodo)
router.put('/registration', registrationValidate, userController.registration)
router.put('/role', userController.addRole)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

router.get('/todo', todoController.getAllTodo)
router.get('/priority', authMiddleware, todoController.getAllPriority)
router.get('/status', authMiddleware, todoController.getAllStatus)
router.put('/priority', authMiddleware, todoController.newPriority)
router.put('/todo', todoController.addTodo)
router.put('/status', authMiddleware, todoController.newStatus)

router.post('/todo', authMiddleware, todoController.updateTodo)

module.exports = router