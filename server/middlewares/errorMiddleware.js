const errorHandler = (err, req, res, next) => {
	console.log(`error: ${err}`)
	const statusCode = res.statusCode ? res.statusCode : 500
	res.status(statusCode)
	res.json({
		message: err.message,
		// stack: 'production' === 'production' ? null : err.stack
	})
}

module.exports = { errorHandler }