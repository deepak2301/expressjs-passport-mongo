import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import GoogleUser from "../mongoose/schemas/google-users.mjs";
dotenv.config();

passport.serializeUser((user, done) => {
  console.log(`Inside serializeUser`);
  console.log(user);

  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await GoogleUser.findById(id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
      scope: ["email", "profile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile); // Debugging profile structure
      let findUser;
      try {
        const email = profile.emails[0].value;
        findUser = await GoogleUser.findOne({ email });
      } catch (error) {
        return done(error, null);
      }
      try {
        if (!findUser) {
          const newUser = new GoogleUser({
            username: profile.displayName, // Use displayName as username
            email: profile.emails[0].value, // Access email correctly
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        return done(null, findUser);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);
