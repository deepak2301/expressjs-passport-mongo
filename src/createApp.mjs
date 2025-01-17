import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import "./strategies/local-strategies.mjs";

import { mockUsers } from "./utils/constants.mjs";

export function createApp() {
  const app = express();

  // Middleware to parse JSON bodies
  app.use(express.json());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000 * 60,
      },
      store: MongoStore.create({ client: mongoose.connection.getClient() }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(routes);

  app.post("/api/auth", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
  });

  app.get("/api/auth/status", (req, res) => {
    console.log("inside auth status");
    console.log(req.user);
    return req.user ? res.send(req.user) : res.sendStatus(401);
  });

  app.get("/", (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.cookie("hello", "world", { maxAge: 60000 * 60, signed: true });

    res.status(201).send({ msg: "hello" });
  });

  app.post("/api/auth", (req, res) => {
    const {
      body: { username, password },
    } = req;

    const findUser = mockUsers.find((user) => user.username === username);

    if (!findUser || findUser.password !== password)
      return res.status(401).send({ msg: "Incorrect Password" });

    req.session.user = findUser;
    return res.status(200).send(findUser);
  });

  app.get("/api/auth/status", (req, res) => {
    req.sessionStore.get(req.session.id, (err, session) => {
      console.log(session);
    });
    return req.session.user
      ? res.status(200).send(req.session.user)
      : res.status(401).send({ msg: "Unauthorized" });
  });

  app.post("/api/auth/logout", (req, res) => {
    if (!req.user) return res.sendStatus(401);
    req.logout((err) => {
      if (err) return res.sendStatus(400);
      res.sendStatus(200);
    });
  });
  // Initiate Google Authentication
  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );

  // Google OAuth Callback
  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      // Successful authentication, redirect or handle the user object.
      res.redirect("/");
    }
  );
  return app;
}
