const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
	try {
		const connString = process.env.MONGO_DB_CONN_STRING
		// console.log(connString)
		const conn = await mongoose.connect(connString)
		console.log(`MongoDB connected`)
		//${conn.connection.srvHost}
	} catch (error) {
		console.log(error)
		// proccess.exit(1)
	}
}

module.exports = connectDB