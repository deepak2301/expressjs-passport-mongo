import * as validator from "express-validator";
import { getUserByIdHandler, createUserHandler } from "../handlers/users.mjs";
import * as helpers from "../utils/helpers.mjs";

import { User } from "../mongoose/schemas/user.mjs";

import { mockUsers } from "../utils/constants.mjs";

//* mocking a module
jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => [{ msg: "Invalid " }]), // Match the expected value
  })),
  matchedData: jest.fn(() => ({
    username: "test",
    password: "password",
    displayName: "test1",
  })),
}));

jest.mock("../mongoose/schemas/user.mjs");

jest.mock("../utils/helpers.mjs", () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
}));

const mockRequest = {
  findUserIndex: 6,
};

const mockResponse = {
  sendStatus: jest.fn(),
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
};

describe("get users", () => {
  it("should get user by id", () => {
    getUserByIdHandler(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith(mockUsers[6]);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });
  it("Should send 404 status when user not found", () => {
    const copyMockRequest = { ...mockRequest, findUserIndex: 100 };
    getUserByIdHandler(copyMockRequest, mockResponse);
    expect(mockResponse.sendStatus).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});

describe("Create Users", () => {
  const mockRequest = {};

  it("Should return a status 400", async () => {
    await createUserHandler(mockRequest, mockResponse);
    expect(validator.validationResult).toHaveBeenCalled();
    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith([{ msg: "Invalid " }]);
  });
  it("should return status 201", async () => {
    jest.spyOn(validator, "validationResult").mockImplementation(() => ({
      isEmpty: jest.fn(() => true),
    }));

    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockResolvedValueOnce({
        id: "1",
        username: "test",
        password: "hashed_password",
        displayName: "test1",
      });

    await createUserHandler(mockRequest, mockResponse);
    expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
    expect(helpers.hashPassword).toHaveBeenCalledWith("password");
    expect(helpers.hashPassword).toHaveReturnedWith("hashed_password");
    expect(User).toHaveBeenCalledWith({
      username: "test",
      password: "hashed_password",
      displayName: "test1",
    });
    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      id: "1",
      username: "test",
      password: "hashed_password",
      displayName: "test1",
    });
  });
  it("should sendStatus of 404 when its failed to save user", async () => {
    jest.spyOn(validator, "validationResult").mockImplementation(() => ({
      isEmpty: jest.fn(() => true),
    }));
    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockImplementation(() => Promise.reject("Failed to save user"));

    await createUserHandler(mockRequest, mockResponse);
    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
  });
});
