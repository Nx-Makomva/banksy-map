const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
jest.mock("../../middleware/upload", () => require("../mocks/multer-s3"));
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
        bookmarkedArtworks: [],
        });

        artwork = await Artwork.create({
        title: "Test Artwork",
        discoveryYear: "2025",
        address: "123 Test Street",
        location: {
            type: "Point",
            coordinates: [-0.45, 45],
        },
        description: "Test artwork",
        themeTags: ["test"],
        photos: ["test.jpg"],
        isAuthenticated: false,
        });

        token = generateToken(user._id);
    });

    describe("POST /bookmarks", () => {
        it("adds a bookmark for the user", async () => {
        const res = await request(app)
            .post("/bookmarks")
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Bookmark added successfully");
        expect(res.body.bookmarkedArtworks).toContain(artwork._id.toString());
        });

        it("returns 400 if artwork is already bookmarked", async () => {
        await request(app)
            .post("/bookmarks")
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        const res = await request(app)
            .post("/bookmarks")
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Artwork already bookmarked");
        });

        it("returns 404 if artwork does not exist", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .post("/bookmarks")
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: fakeId });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Artwork not found");
        });

        it("returns 400 if artwork_id is missing", async () => {
        const res = await request(app)
            .post("/bookmarks")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(res.statusCode).toBe(404); 
        });
    });

    describe("DELETE /bookmarks/:id", () => {
        it("removes a bookmark for the user", async () => {
        await request(app)
            .post("/bookmarks")
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        const res = await request(app)
            .delete(`/bookmarks/${artwork._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Bookmark removed successfully");
        expect(res.body.bookmarkedArtworks).not.toContain(artwork._id.toString());
        });

        it("returns 200 even if artwork is not bookmarked", async () => {
        const res = await request(app)
            .delete(`/bookmarks/${artwork._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Bookmark removed successfully");
        });
    });
});