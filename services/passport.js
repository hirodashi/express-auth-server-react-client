const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const keys = require('../config/keys.js')
// one argument here fetches the uses, two would put something
const User = mongoose.model('users')

// serialize after making new or creating a user
// put identifying piece of info into the cookie
passport.serializeUser((user, done)=> {
  done(null, user.id)
})

// take it back out
passport.deserializeUser((id, done)=> {
  User.findById(id).then( user => {
    done(null, user);
  })
})

// use the google strat with passport, which returns tokens, etc.
passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback',
  proxy: true
},
async (accessToken, refreshToken, profile, done) => {
  // check if user already exists
  const existingUser = await User.findOne({googleID: profile.id})

    if (existingUser) {
      // first arg because no err of course
      return done(null, existingUser)

    }
      // doesn't exists so create / else removed because may return above
      const user = await new User({googleID:profile.id}).save()
      // after async save call done
      done(null, user)

})
)
