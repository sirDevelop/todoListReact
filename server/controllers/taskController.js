const asyncHandler = require('express-async-handler')
const Tasks = require('../models/Tasks')

const getTasks = asyncHandler(async (req, res) => {
    try{
        const email = req.user.emails[0].value ? req.user.emails[0].value:uuidv4()
        const tasks = await Tasks.find({userEmail: req.user.emails[0].value});
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
	// const userEmail = req.user.email
    const { description, status, date } = req.body
	const taskResult = await Tasks.create({
		description, status, date
		// user
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