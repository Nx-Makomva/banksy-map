const request = require("supertest");
const app = require("../../app");
const jwt = require("jsonwebtoken")
const User = require("../../models/user");
const Artwork = require("../../models/artwork"); 
const Badge = require("../../models/badge");
jest.mock('../../middleware/upload', () => require('../mocks/multer-s3'));

require("../mongodb_helper");


describe("GET /users/current with JWT", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("returns anonymous if no token", async () => {
    const response = await request(app).get("/users/current");

    expect(response.body).toEqual({
      _id: null,
    });
  });

  it("returns user info for valid token", async () => {
  const newUser = await User.create({
    email: "jane@example.com",
    password: "hashedpass",
    firstName: "Jane",
    lastName: "Doe",
    badges: [] 
  });

  const token = jwt.sign(
    { sub: newUser._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const response = await request(app)
    .get("/users/current")
    .set("Authorization", `Bearer ${token}`);

  // Convert Mongoose doc to plain object and remove version key
  const expectedUser = newUser.toObject();
  delete expectedUser.__v;
  delete expectedUser.password; 

  expect(response.body.firstName).toEqual(expectedUser.firstName);
  expect(response.body.lastName).toEqual(expectedUser.lastName);
  expect(response.body.badges.length).toEqual(1);
});

  it("returns anonymous if token is valid but user not found", async () => {
    const fakeUserId = new User()._id;
    const token = jwt.sign({ sub: fakeUserId.toString() }, process.env.JWT_SECRET);

    const response = await request(app)
      .get("/users/current")
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toEqual({
      _id: null,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ _id: null });
  });
  });

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
    expect(response.body.message).toBe("Missing required fields");

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
    expect(response.body.user.firstName).toBe("Jane");
    expect(response.body.user.lastName).toBe("Doe");
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


describe("PATCH /users/:id/badges/:badgeId", () => {
  let user;

  beforeEach(async () => {
    await User.deleteMany({});
    await Badge.deleteMany({});
    user = await User.create({
      email: "john@example.com",
      password: "hashedpass",
      firstName: "John",
      lastName: "Smith",
      bookmarkedArtworks: [],
    });
  });

  const createValidBadge = async () => {
    return await Badge.create({
        name: "Test Badge",
        description: "A badge awarded for testing purposes", 
        icon: "test-icon.png", 
        criteria: {
            type: "visits", 
            count: 5 
        }
    });
};


  it("adds a new badgeId to user's badges", async () => {
    const badge = await createValidBadge();

    const response = await request(app).patch(
      `/users/${user._id}/badges/${badge._id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Badge added successfully");
    expect(response.body.user.badges).toContain(badge._id.toString());

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.badges).toContainEqual(badge._id);
  });

  it("does not add duplicate artworkId", async () => {
    const badge = await createValidBadge();

    user.badges.push(badge._id);
    await user.save();

    const response = await request(app).patch(
      `/users/${user._id}/badges/${badge._id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.user.badges.length).toBe(1);
  });

  it("returns 404 if user is not found", async () => {
    const badge = await createValidBadge();
    const tempUser = await User.create({
      email: "temp@example.com",
      password: "temp123",
      firstName: "Vasya",
      lastName: "Petrov"
    });

    const nonExistentUserId = tempUser._id;
    await User.findByIdAndDelete(nonExistentUserId);

    const response = await request(app).patch(
      `/users/${nonExistentUserId}/badges/${badge._id}`
    );

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});