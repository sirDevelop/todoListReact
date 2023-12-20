const asyncHandler = require('express-async-handler')
const Tasks = require('../models/Tasks')
const { uuid } = require('uuidv4');

const getTasks = asyncHandler(async (req, res) => {
    try{
        const email = req.user && req.user.emails && req.user.emails.length ? req.user.emails[0].value:uuid()
        const tasks = await Tasks.find({userEmail: email});
        res.status(200).json({
            tasks
        })
    }
    catch(error) {
        res.status(422)
		throw new Error('Something went wrong when retrieving tasks ' + error)
    }
});

const addTask = asyncHandler(async (req, res) => {
	const userEmail = req.user.emails[0].value
    const { description } = req.body
    const date = new Date()
    
	const taskResult = await Tasks.create({
		userEmail, description, status: "pending", date
	})

	console.log(`New listing created with the following id: ${taskResult.insertedId}`);

	res.status(200).json({
		taskResult
	})
});

const editTask = asyncHandler(async (req, res) => {
    // allow it to change the status/description/date
});

const deleteTask = asyncHandler(async (req, res) => {
});

const deleteAllTasks = asyncHandler(async (req, res) => {
});

module.exports = { getTasks, addTask, editTask, deleteTask, deleteAllTasks };