const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");
require("../mongodb_helper");


describe("POST /users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("creates a new user and returns 201", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        email: "test@example.com",
        password: "supersecurepassword",
        firstName: "Test",
        lastName: "Tester"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("OK");

    const users = await User.find();
    expect(users.length).toBe(1);
    expect(users[0].email).toBe("test@example.com");
    expect(users[0].firstName).toBe("Test");
  });

  it("returns 400 if required fields are missing", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        email: "missingpassword@example.com",
        firstName: "NoPass"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Something went wrong");

    const users = await User.find();
    expect(users.length).toBe(0);
  });
});

describe("GET /users/:id", () => {
  let createdUser;

  beforeEach(async () => {
    await User.deleteMany({});
    createdUser = await User.create({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "password123",
    });
  });

  it("returns a user by ID with status 200", async () => {
    const response = await request(app).get(`/users/${createdUser._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user.email).toBe("jane@example.com");
    expect(response.body.user.firstName).toBe("Jane");
  });

  it("returns 404 if user is not found", async () => {
    const fakeId = "649a3607bcf86cd799439011"; // valid ObjectId but not in DB
    const response = await request(app).get(`/users/${fakeId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("returns 500 if invalid ID format", async () => {
    const response = await request(app).get(`/users/notanid`);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Server error");
  });
});