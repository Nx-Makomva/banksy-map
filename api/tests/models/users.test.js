require("../mongodb_helper");
const User = require("../../models/user");
const mongoose = require("mongoose");

describe("User model", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("has a first name", () => {
    const user = new User({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "securepass123",
    });
    expect(user.firstName).toEqual("Jane");
  });

  it("has a last name", () => {
    const user = new User({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "securepass123",
    });
    expect(user.lastName).toEqual("Doe");
  });

  it("has an email address", () => {
    const user = new User({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "securepass123",
    });
    expect(user.email).toEqual("jane@example.com");
  });

  it("has a password", () => {
    const user = new User({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "securepass123",
    });
    expect(user.password).toEqual("securepass123");
  });

  it("defaults to empty bookmarkedArtworks array", () => {
    const user = new User({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "securepass123",
    });
    expect(user.bookmarkedArtworks).toEqual([]);
  });

  it("defaults to empty visitedArtworks array", () => {
    const user = new User({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "securepass123",
    });
    expect(user.visitedArtworks).toEqual([]);
  });

  it("defaults to empty badges array", () => {
    const user = new User({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "securepass123",
    });
    expect(user.badges).toEqual([]);
  });

  it("can save a user and retrieve it", async () => {
    const user = new User({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "securepass123",
    });

    await user.save();
    const users = await User.find();
    expect(users.length).toBe(1);
    expect(users[0].firstName).toEqual("Jane");
    expect(users[0].email).toEqual("jane@example.com");
  });

  it("can list all users (empty initially)", async () => {
    const users = await User.find();
    expect(users).toEqual([]);
  });

  it("can save a user with bookmarkedArtworks, visitedArtworks and badges", async () => {
    const fakeArtworkId = new mongoose.Types.ObjectId();
    const fakeBadgeId = new mongoose.Types.ObjectId();

    const user = new User({
      firstName: "Alex",
      lastName: "Smith",
      email: "alex@example.com",
      password: "mypassword",
      bookmarkedArtworks: [fakeArtworkId],
      visitedArtworks: [fakeArtworkId],
      badges: [fakeBadgeId],
    });

    await user.save();
    const savedUser = await User.findOne({ email: "alex@example.com" });

    expect(savedUser.bookmarkedArtworks[0].toString()).toEqual(fakeArtworkId.toString());
    expect(savedUser.visitedArtworks[0].toString()).toEqual(fakeArtworkId.toString());
    expect(savedUser.badges[0].toString()).toEqual(fakeBadgeId.toString());
  });
});
