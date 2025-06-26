const {generateToken } = require("../../lib/token");
const request = require("supertest");
const app = require("../../app");
const Comment = require("../../models/comments");
const Artwork = require("../../models/artwork");
const User = require("../../models/user");
const { default: mongoose } = require("mongoose");
jest.mock('../../middleware/upload', () => require('../mocks/multer-s3'));

require("../mongodb_helper");

describe("/comments", () => {
  let testUser, testArtwork, authToken;

  beforeEach(async () => {
    await Comment.deleteMany({});
    await Artwork.deleteMany({});
    await User.deleteMany({});

    testUser = await User.create({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password123"
    });

    testArtwork = await Artwork.create({
      title: "Test Artwork",
      discoveryYear: "2023",
      address: "25, Test Street, Mountain View, London",
      location: {
        type: 'Point',
        coordinates: [-0.45, 45]
      },
      description: "Test artwork for comments",
      themeTags: ['test'],
      photos: ['test.jpg'],
      isAuthenticated: false,
      comments: []
    });

    authToken = generateToken(testUser._id);

    console.log("Test user ID:", testUser._id);
    console.log("Test artwork ID:", testArtwork._id);
    console.log("Auth token:", authToken ? "Present" : "Missing");
    
  });

  describe("POST /:artwork_id, when all fields are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post(`/comments/${testArtwork._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          text: "This is arty!"
        });

      expect(response.statusCode).toBe(201);
    });

    test("creates a comment when all fields are provided", async () => {
      const response = await request(app)
        .post(`/comments/${testArtwork._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          text: "This is arty!"
        });

      console.log("Response status:", response.statusCode);
      console.log("Response body:", JSON.stringify(response.body, null, 2));

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("Comment created successfully");
      expect(response.body.comment.text).toBe("This is arty!");
      expect(response.body.comment.user_id).toBe(testUser._id.toString());
      expect(response.body.comment.artwork_id).toBe(testArtwork._id.toString());
      expect(response.body.username).toBe("Test");
      expect(response.body.timestamp).toBeDefined();
    });

    test("adds comment to artwork's comments array", async () => {
      const response = await request(app)
        .post(`/comments/${testArtwork._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          text: "Amazing piece!"
        });

      const updatedArtwork = await Artwork.findById(testArtwork._id);
      expect(updatedArtwork.comments).toHaveLength(1);
      expect(updatedArtwork.comments[0].toString()).toBe(response.body.comment._id);
    });

    describe("POST /:artwork_id, when text is missing", () => {
      test("response code is 400", async () => {
        const response = await request(app)
          .post(`/comments/${testArtwork._id}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send({});

        expect(response.statusCode).toBe(400);
      });

      test("does not create comment", async () => {
        await request(app)
          .post(`/comments/${testArtwork._id}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send({});

        const comments = await Comment.find();
        expect(comments.length).toEqual(0);
      });
    });

    describe("POST /:artwork_id, when user not found", () => {
      test("response code is 404", async () => {
        const fakeToken = generateToken(new mongoose.Types.ObjectId());

        const response = await request(app)
          .post(`/comments/${testArtwork._id}`)
          .set("Authorization", `Bearer ${fakeToken}`)
          .send({
            text: "This won't work"
          });

        expect(response.statusCode).toBe(404);
      });

      test("returns appropriate error message", async () => {
        const fakeToken = generateToken(new mongoose.Types.ObjectId());

        const response = await request(app)
          .post(`/comments/${testArtwork._id}`)
          .set("Authorization", `Bearer ${fakeToken}`)
          .send({
            text: "This won't work"
          });

        expect(response.body.message).toBe("User not found");
      });
    });
  });

  describe("GET /me, all user comments", () => {
    beforeEach(async () => {
      await Comment.create({
        user_id: testUser._id,
        artwork_id: testArtwork._id,
        text: "First comment"
      });

      await Comment.create({
        user_id: testUser._id,
        artwork_id: testArtwork._id,
        text: "Second comment"
      });

      const otherUser = await User.create({
        firstName: "Other",
        lastName: "User",
        email: "other@example.com",
        password: "password123"
      });

      await Comment.create({
        user_id: otherUser._id,
        artwork_id: testArtwork._id,
        text: "Other user's comment"
      });
    });

    test("returns all comments for authenticated user", async () => {
      const response = await request(app)
        .get("/comments/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.comments).toHaveLength(2);
      expect(response.body.count).toBe(2);
      
      const commentTexts = response.body.comments.map(c => c.text);
      expect(commentTexts).toContain("First comment");
      expect(commentTexts).toContain("Second comment");
      expect(commentTexts).not.toContain("Other user's comment");
    });

    test("returns populated user and artwork data", async () => {
      const response = await request(app)
        .get("/comments/me")
        .set("Authorization", `Bearer ${authToken}`);

      const comment = response.body.comments[0];
      expect(comment.user_id.firstName).toBe("Test");
      expect(comment.artwork_id.title).toBe("Test Artwork");
      expect(comment.artwork_id.photos).toEqual(['test.jpg']);
    });

    test("returns empty array when user has no comments", async () => {
      const newUser = await User.create({
        firstName: "New",
        lastName: "User",
        email: "new@example.com",
        password: "password123"
      });

      const newToken = generateToken(newUser._id);

      const response = await request(app)
        .get("/comments/me")
        .set("Authorization", `Bearer ${newToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.comments).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });
  });

  describe("PATCH /:id, update comment", () => {
    let testComment;

    beforeEach(async () => {
      testComment = await Comment.create({
        user_id: testUser._id,
        artwork_id: testArtwork._id,
        text: "Original comment text"
      });
    });

    test("updates comment text successfully", async () => {
      const response = await request(app)
        .patch(`/comments/${testComment._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          text: "Updated comment text"
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Comment updated successfully");
      expect(response.body.updatedComment.text).toBe("Updated comment text");
      expect(response.body.updatedComment._id).toBe(testComment._id.toString());
    });

    test("validates updated data", async () => {
      const response = await request(app)
        .patch(`/comments/${testComment._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          text: "Valid update"
        });

      expect(response.statusCode).toBe(200);
      
      // Verify the comment was actually updated in database
      const updatedComment = await Comment.findById(testComment._id);
      expect(updatedComment.text).toBe("Valid update");
    });

    describe("PATCH /:id, when comment not found", () => {
      test("response code is 404", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        
        const response = await request(app)
          .patch(`/comments/${fakeId}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send({
            text: "This won't work"
          });

        expect(response.statusCode).toBe(404);
      });

      test("returns appropriate error message", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        
        const response = await request(app)
          .patch(`/comments/${fakeId}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send({
            text: "This won't work"
          });

        expect(response.body.message).toBe("Comment not found");
      });
    });
  });

  describe("DELETE /:id, remove comment", () => {
    let testComment;

    beforeEach(async () => {
      testComment = await Comment.create({
        user_id: testUser._id,
        artwork_id: testArtwork._id,
        text: "Comment to be deleted"
      });
    });

    test("deletes comment successfully", async () => {
      const response = await request(app)
        .delete(`/comments/${testComment._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Comment successfully deleted");
      expect(response.body.deletedComment._id).toBe(testComment._id.toString());
      expect(response.body.deletedComment.text).toBe("Comment to be deleted");
    });

    test("removes comment from database", async () => {
      await request(app)
        .delete(`/comments/${testComment._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      const deletedComment = await Comment.findById(testComment._id);
      expect(deletedComment).toBeNull();
    });

    test("does not delete other comments", async () => {
      const otherComment = await Comment.create({
        user_id: testUser._id,
        artwork_id: testArtwork._id,
        text: "This should remain"
      });

      await request(app)
        .delete(`/comments/${testComment._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      const remainingComment = await Comment.findById(otherComment._id);
      expect(remainingComment).not.toBeNull();
      expect(remainingComment.text).toBe("This should remain");
    });

    describe("DELETE /:id, when comment not found", () => {
      test("response code is 404", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        
        const response = await request(app)
          .delete(`/comments/${fakeId}`)
          .set("Authorization", `Bearer ${authToken}`);

        expect(response.statusCode).toBe(404);
      });

      test("returns appropriate error message", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        
        const response = await request(app)
          .delete(`/comments/${fakeId}`)
          .set("Authorization", `Bearer ${authToken}`);

        expect(response.body.message).toBe("Comment not found");
      });
    });
  });
});