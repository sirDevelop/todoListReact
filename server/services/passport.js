const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const Tasks = require('../models/Tasks')

passport.use(
	new GoogleStrategy(
		{
			// clientID: keys.googleClientID,
			// clientSecret: keys.googleClientSecret,
			clientID: process.env.googleClientID,
			clientSecret: process.env.googleClientSecret,
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		
		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	)
);

passport.serializeUser(async (req, user, done) => {
	// called only when you sign in
	if (req.cookies.guestUserId && user && user.emails && user.emails[0] && user.emails[0].value) {
		await Tasks.updateMany({ userEmail: req.cookies.guestUserId }, { userEmail: user.emails[0].value })
		req.res.clearCookie("guestUserId")
	}
	done(null, user);
});

passport.deserializeUser(async (req, user, done) => {
	//called every time page is refreshed
	if (req.cookies.guestUserId && user && user.emails && user.emails[0] && user.emails[0].value){
		await Tasks.updateMany({ userEmail: req.cookies.guestUserId }, { userEmail: user.emails[0].value })
		req.res.clearCookie("guestUserId")
	}
	done(null, user);
});
