import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  console.log(`Inside serializeUser`);
  console.log(user);

  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`Inside deserializeUser`);
  console.log(id);

  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error("User not found");
      if (!comparePassword(password, findUser.password))
        throw new Error("Invalid password");
      return done(null, findUser);
    } catch (error) {
      return done(error, null);
    }
  })
);
