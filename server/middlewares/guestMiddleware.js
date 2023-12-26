const asyncHandler = require('express-async-handler')
const { uuid } = require('uuidv4');

const GuestAuthentication = asyncHandler(async (req, res, next) => {
	try {
		if (!req.user && !req.cookies.guestUserId) {
			const uuidToken = uuid()
			req.user = { emails: [{ value: uuidToken }] }
			res.cookie("guestUserId", uuidToken, {
				path: "/",
				sameSite: "none",
				maxAge: 99999999,
				secure: true,
			})
		}else if(req.cookies.guestUserId){
			req.user = { emails: [{ value: req.cookies.guestUserId }] }
		}
		next()
	} catch (error) {
		res.status(401)
		throw new Error('Something went wrong while trying to do run GuestAuthentication')
	}
})

module.exports = { GuestAuthentication }