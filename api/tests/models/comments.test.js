// TODO: 
// Write test files for models
// write controller methods
// write test files for controller methods
// create routes for artwork

require('../mongodb_helper');
const mongoose = require('mongoose');
const Comment = require('../../models/comments');
const User = require('../../models/user');
const Artwork = require('../../models/artwork');

// first check basic model construction
// next test model relationship

describe("Comments model constructs correctly", () => {
  beforeEach(async () => {
    await Comment.deleteMany({}) 
  })
  it("it creates a basic, valid comment", async () => {
    const comment = await Comment.create({
      user_id: new mongoose.Types.ObjectId(),
      artwork_id: new mongoose.Types.ObjectId(),
      text: 'I have fake ids'
    });

    expect(comment.text).toBe('I have fake ids');
    expect(comment.createdAt).toBeDefined()
  })
  // END OF DESCRIBE //
})