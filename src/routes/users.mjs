import { Router } from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchema.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middleware.mjs";
import User from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
const router = Router();

router.get(
  "/api/users/",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Field should not be empty")
    .isLength({ min: 3, max: 12 })
    .withMessage("atleast 3-12 characters"),
  (req, res) => {
    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) throw err;

      console.log(sessionData);
    });

    const result = validationResult(req);
    console.log(result);
    const {
      query: { filter, value },
    } = req;
    // when filter and value are undefined
    if (!filter && !value) return res.send(mockUsers);
    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    res.send(mockUsers);
  }
);
router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  return res.send(findUser);
});

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),

  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });
    const data = matchedData(req);
    data.password = hashPassword(data.password);
    const newUser = new User(data);
    try {
      await newUser.save();
      return res.status(201).send(newUser);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: "Internal Server Error" });
    }

    // const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    // mockUsers.push(newUser);
    // return res.status(201).send(newUser);
  }
);

router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  mockUsers.splice(findUserIndex, 1);
  res.sendStatus(204);
});

export default router;
