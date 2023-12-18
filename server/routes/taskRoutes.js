const express = require('express')
const router = express.Router()
const { getTasks, addTask, editTask, deleteTask, deleteAllTasks } = require('../controllers/taskController')

router.post('/getTasks', getTasks)
router.post('/addTask', addTask)
router.post('/editTask', editTask)
router.post('/deleteTask', deleteTask)
router.post('/deleteAllTasks', deleteAllTasks)

module.exports = router