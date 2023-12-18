const net = require('net')
const server = net.createServer()
let port = 9000

// start the server to check is there any error with port
server.listen(port)
// if there is any error
server.once('error', (e) => {
	// if the error is port related
	if (e.code === 'EADDRINUSE') {
		// change the port
		port = port + 1
		// start the server again to test the new port
		server.listen(port)
	}
})
// close the server because its just for testing the port and checking is there any error
server.once('listening', function () { server.close() })
// if the server is closed which means we know the right port now then start the actual application
server.once('close', function () {
	require("dotenv").config()
	const mongoose = require('mongoose');
	const cookieSession = require('cookie-session');
	const bodyParser = require('body-parser');
	// const keys = require('./config/keys');
	const express = require('express')
	const router = express.Router()
	const cors = require('cors')
	const { errorHandler } = require('./middlewares/errorMiddleware')
	const connectDB = require('./config/db')
	const app = express()
	const cookieParser = require('cookie-parser')
	const passport = require('passport');
	const passportStrategy = require("./services/passport");
	const origins = [...process.env.FRONT_END_URL.split(" ")]

	connectDB()

	app.use(cookieParser())

	app.use(
		cookieSession({
			name: "session",
			maxAge: 30 * 24 * 60 * 60 * 1000,
			keys: [process.env.cookieKey]
		})
	)

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(cors({
		origin: origins,
		credentials: true
	}))

	app.use(express.json())
	app.use(express.urlencoded({ extended: false }))

	app.use("/api/tasks", require("./routes/taskRoutes"))
	app.use("/auth", require("./routes/authRoutes"));

	app.use(errorHandler)
	app.listen(port, () => { console.log(`Server started on port ${port}`) })

})