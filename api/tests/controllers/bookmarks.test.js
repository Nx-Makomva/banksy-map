const request = require("supertest");
const app = require("../../app");
const { default: mongoose } = require("mongoose");
jest.mock('../../middleware/upload', () => require('../mocks/multer-s3'));
const User = require("../../models/user");
const Artwork = require("../../models/artwork");
const { generateToken } = require("../../lib/token");

require("../mongodb_helper");

describe("/bookmarks", () => {
    let user, token, artwork;

    beforeEach(async () => {
        await User.deleteMany({});
        await Artwork.deleteMany({});

        user = await User.create({
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
        password: "password123",
        bookmarkedArtworks: []
        });

        artwork = await Artwork.create({
        title: "Test Artwork",
        discoveryYear: "2025",
        address: "123 Test Street",
        location: {
            type: "Point",
            coordinates: [-0.45, 45]
        },
        description: "Test artwork",
        themeTags: ["test"],
        photos: ["test.jpg"],
        isAuthenticated: false,
        });

        token = generateToken(user._id);
    });

    describe("POST /bookmarks/:userId", () => {
        test("adds a bookmark for the user", async () => {
        const response = await request(app)
            .post(`/bookmarks/${user._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Bookmark added successfully");
        expect(response.body.bookmarkedArtworks).toContain(artwork._id.toString());
        });

        test("returns 400 if artwork is already bookmarked", async () => {
        await request(app)
            .post(`/bookmarks/${user._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        const response = await request(app)
            .post(`/bookmarks/${user._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Artwork already bookmarked");
        });
    });

    describe("GET /bookmarks/:userId", () => {
        test("returns all bookmarks for user", async () => {
        await request(app)
            .post(`/bookmarks/${user._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        const response = await request(app)
            .get(`/bookmarks/${user._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.bookmarks.length).toBe(1);
        expect(response.body.bookmarks[0]._id).toBe(artwork._id.toString());
        });
    });

    describe("DELETE /bookmarks/:userId/:artworkId", () => {
        test("removes a bookmark", async () => {
        await request(app)
            .post(`/bookmarks/${user._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        const response = await request(app)
            .delete(`/bookmarks/${user._id}/${artwork._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Bookmark removed successfully");

        const userInDb = await User.findById(user._id);
        expect(userInDb.bookmarkedArtworks).not.toContainEqual(artwork._id);
        });

        test("returns 404 if user not found", async () => {
        const fakeUserId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .delete(`/bookmarks/${fakeUserId}/${artwork._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("User not found");
        });
    });
});