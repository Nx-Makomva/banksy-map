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

    describe("POST /bookmarks", () => {
        test("adds a bookmark for the user", async () => {
        const response = await request(app)
            .post(`/bookmarks`)
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Bookmark added successfully");
        expect(response.body.bookmarkedArtworks).toContain(artwork._id.toString());
        });

    test("returns 400 if artwork is already bookmarked", async () => {
        await request(app)
            .post(`/bookmarks`)
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        const response = await request(app)
            .post(`/bookmarks`)
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Artwork already bookmarked");
        });
    });

    describe("DELETE /bookmarks/:id", () => {
        it("should return 401 if token is invalid", async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
            .delete(`/bookmarks/${fakeId}`)
            .set("Authorization", "Bearer invalid_token");

            expect(res.statusCode).toBe(401);
        });
    });

    describe("GET /bookmarks", () => {
        test("returns all bookmarks for the authenticated user", async () => {
        // First add a bookmark for the user
            await request(app)
            .post("/bookmarks")
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

            // Now fetch all bookmarks
            const response = await request(app)
            .get("/bookmarks")
            .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.bookmarks).toBeInstanceOf(Array);
            expect(response.body.count).toBe(1);
            expect(response.body.bookmarks[0]._id).toBe(artwork._id.toString());
            expect(response.body.bookmarks[0].title).toBe("Test Artwork");
        });

        test("returns 401 if no token or invalid token provided", async () => {
            const response = await request(app).get("/bookmarks");

            expect(response.statusCode).toBe(404);
        });

        test("returns empty array if user has no bookmarks", async () => {
            const response = await request(app)
            .get("/bookmarks")
            .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.bookmarks).toEqual([]);
            expect(response.body.count).toBe(0);
        });
        });

});