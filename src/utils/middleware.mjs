import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserId = (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  // Check if the ID is a valid number
  if (isNaN(parsedId)) return res.sendStatus(400);

  // Find the user index by ID
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  // If user not found, send 404 status
  if (findUserIndex === -1) return res.sendStatus(404);

  // Attach the found user index to the request object
  req.findUserIndex = findUserIndex;
  next();
};

export const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send({ msg: "Unauthorized" });
  }
  next();
};
