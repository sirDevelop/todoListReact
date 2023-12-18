const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
	description: {
		type: String,
        required: [true, 'description is required'],
		unique: true,
	},
    status: {
		type: String,
        required: [true, 'status is required']
	},
    date: {
        type: Date,
        required: [true, 'date is required'],
    },
	userEmail: {
		type: String,
		required: [true, 'Please fill the name field'],
	}
}, { timestamps: true })
module.exports = mongoose.model('Task', taskSchema)