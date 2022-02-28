const LocalStrategy = require("passport-local").Strategy;
const { dbObject } = require("../database/db");
const bcrypt = require("bcryptjs");

function InitializePassport(passport) {
  try {
    passport.use(
      new LocalStrategy(
        { usernameField: "voterKey", passwordField: "voterPass" },
        async (voterKey, voterPass, done) => {
          const user = await dbObject.GetVoterByKey(voterKey.trim());
          if (user.length > 0) {
            //check the users password
            const ourUser = user[0];

            const isMatch = voterPass === ourUser.voter_pass;
            console.log(isMatch);
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Invalid Voting Credentials",
              });
            }
          } else {
            return done(null, false, {
              message: "Not a valid voterKey",
            });
          }
        }
      )
    );

    passport.serializeUser((ourUser, done) => {
      done(null, ourUser[0].voters_id);
    });

    passport.deserializeUser(async (id, done) => {
      const users = await dbObject.GetVoterByID(id);
      const user = users[0];
      done(null, user);
    });
  } catch (error) {
    throw error;
  }
}
module.exports = InitializePassport;
