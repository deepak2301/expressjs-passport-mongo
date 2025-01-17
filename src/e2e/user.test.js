import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../createApp.mjs";

describe("create user and login", () => {
  let app;
  beforeAll(() => {
    mongoose
      .connect("mongodb://localhost/express_js_test")
      .then(() => console.log("Connected to MongoDB-test"))
      .catch((err) => console.log(err));

    app = createApp();
  });
  it("Should check user is created ", async () => {
    const response = await request(app).post("/api/users").send({
      username: "lxydeep4",
      password: "hello1234",
      displayName: "idksss",
    });
    expect(response.statusCode).toBe(201);
  });

  it("should log the user in and visit /api/auth/status and return user", async () => {
    const response = await request(app)
      .post("/api/auth")
      .send({
        username: "lxydeep4",
        password: "hello1234",
      })
      .then((res) => {
        return request(app)
          .get("/api/auth/status")
          .set("Cookie", res.headers["set-cookie"]);
      });
    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
