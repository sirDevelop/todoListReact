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
		userEmail, description, status: "Pending", date
	})

	console.log(`New listing created with the following id: ${taskResult._id}`);

	res.status(200).json({
		taskResult
	})
});

const editTask = asyncHandler(async (req, res) => {
    // allow it to change the status/description/date
    const userEmail = req.user.emails[0].value
    const { _id, date, description, status } = req.body
    console.log( _id);
    console.log(date);
    console.log(description);
    console.log(status);

	const taskResult = await Tasks.updateOne(
		{_id, userEmail},
        { date, description, status}
        )

	console.log(`Number of documents modified: ${taskResult.modifiedCount}`);

	res.status(200).json({
		taskResult
	})
});

const deleteTask = asyncHandler(async (req, res) => {
    const userEmail = req.user.emails[0].value
    const { id } = req.body
    
	const taskResult = await Tasks.deleteOne({
		userEmail, _id: id
	})

	console.log(`Number of documents removed: ${taskResult.deletedCount}`);

	res.status(200).json({
		taskResult
	})
});

const deleteAllTasks = asyncHandler(async (req, res) => {

	const taskResult = await Tasks.deleteMany({})

	console.log(`All tasks deleted with the following result: ${taskResult}`);

	res.status(200).json({
		taskResult
	})
});

module.exports = { getTasks, addTask, editTask, deleteTask, deleteAllTasks };