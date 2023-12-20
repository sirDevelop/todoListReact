const express = require('express')
const router = express.Router()
const passport = require("passport");
const { uuid } = require('uuidv4');
// const { v4: uuidv4 } = require('uuid');

// verify user logged in
router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Logged In",
			user: req.user,
		});
	} else {
		try {
			const token = uuid()
			req.user = {emails: [{value: token}]}
			res.cookie('fakeLogin', token, { path: '/', sameSite: 'none', maxAge: 99999999 })
			res.status(200).json({
				error: false,
				message: "Successfully Logged In",
				user: req.user,
			});
			// res.status(403).json({ error: true, message: "Not Authorized" });
		} catch (error) {
			console.log(error)
		}
	}
});

// in case login failed or cookies expired
router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

// login proccess
router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: "http://localhost:3000",
		failureRedirect: "/login/failed",
	})
);

router.get("/logout", (req, res) => {
	req.logout();
	res.status(200).json({
		error: false,
		message: "Successfully Logged Out"
	});
});


router.get("/google", passport.authenticate("google", ["profile", "email"]));

module.exports = router;