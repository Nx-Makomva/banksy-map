const request = require("supertest");
const app = require("../../app");
const { default: mongoose } = require("mongoose");
jest.mock('../../middleware/upload', () => require('../mocks/multer-s3'));
const User = require("../../models/user");
const Artwork = require("../../models/artwork");
const { generateToken } = require("../../lib/token");

require("../mongodb_helper");

describe("/visits", () => {
    let user, token, artwork;

    beforeEach(async () => {
        await User.deleteMany({});
        await Artwork.deleteMany({});

        user = await User.create({
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
        password: "password123",
        visitedArtworks: []
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

    describe("POST /visits", () => {
        test("adds a visit for the user", async () => {
        const response = await request(app)
            .post(`/visits`)
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Visit added successfully");
        expect(response.body.visitedArtworks).toContain(artwork._id.toString());
        });

        test("returns 400 if artwork is already visited", async () => {
        await request(app)
            .post(`/visits`)
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        const response = await request(app)
            .post(`/visits`)
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Artwork already bookmarked");
        });

        test("returns 404 if artwork does not exist", async () => {
        const fakeArtworkId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .post(`/visits`)
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: fakeArtworkId });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Artwork not found");
        });

        test("returns 400 if artwork_id is missing", async () => {
        const response = await request(app)
            .post(`/visits`)
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response.statusCode).toBe(404);
        });
    });

    describe("DELETE /visits/:id", () => {
        it("removes a visit for the user", async () => {
        await request(app)
            .post(`/visits`)
            .set("Authorization", `Bearer ${token}`)
            .send({ artwork_id: artwork._id.toString() });

        const res = await request(app)
            .delete(`/visits/${artwork._id.toString()}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Visit removed successfully");
        expect(res.body.visitedArtworks).not.toContain(artwork._id.toString());
        });

        it("returns 200 even if artwork is not visited", async () => {
        const res = await request(app)
            .delete(`/visits/${artwork._id.toString()}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Visit removed successfully");
        });
    });
});
