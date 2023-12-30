const asyncHandler = require('express-async-handler')
const Tasks = require('../models/Tasks')
const { uuid } = require('uuidv4');

const getTasks = asyncHandler(async (req, res) => {
    try{
		const userEmail = req.user.emails[0].value
        const tasks = await Tasks.find({userEmail});
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
    const { date, description } = req.body
    
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
	if(!userEmail && req.cookies.guestUserId) {
		userEmail = req.cookies.guestUserId;
	}

    const { _id, date, description, status } = req.body

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
	if(!userEmail && req.cookies.guestUserId) {
		userEmail = req.cookies.guestUserId;
	}

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
	const userEmail = req.user.emails[0].value
	if(!userEmail && req.cookies.guestUserId) {
		userEmail = req.cookies.guestUserId;
	}

	const taskResult = await Tasks.deleteMany({userEmail})

	console.log(`All tasks deleted with the following result: ${taskResult}`);

	res.status(200).json({
		taskResult
	})
});

module.exports = { getTasks, addTask, editTask, deleteTask, deleteAllTasks };