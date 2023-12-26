const express = require('express')
const router = express.Router()
const { getTasks, addTask, editTask, deleteTask, deleteAllTasks } = require('../controllers/taskController')
const { GuestAuthentication } = require("../middlewares/guestMiddleware")

router.post('/getTasks', [GuestAuthentication], getTasks)
router.post('/addTask', [GuestAuthentication], addTask)
router.post('/editTask', [GuestAuthentication], editTask)
router.post('/deleteTask', [GuestAuthentication], deleteTask)
router.post('/deleteAllTasks', [GuestAuthentication], deleteAllTasks)

module.exports = router