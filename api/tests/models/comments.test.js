require('../mongodb_helper');
const mongoose = require('mongoose');
const Comment = require('../../models/comments');
const User = require('../../models/user');
const Artwork = require('../../models/artwork');

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
});

describe("Comments construct correctly with real user and artwork objects", () => {
  let testUser;
  let testArtwork;

  beforeEach(async () => {
    await User.deleteMany({});
    await Artwork.deleteMany({});

    testUser = await User.create({
      firstName: 'Johnny',
      lastName: 'Bravo',
      email: 'john@email.com',
      password: 'Johnsecure!'
    });

    testArtwork = await Artwork.create({
      title: 'Millenial child',
      discoveryYear: '2004',
      address: '12, Fake Ville, London',
      location: {
          type: 'Point',
          coordinates: [-165, 40]
      },
      description: 'Test description',
      themeTags: ['test', 'person'],
      photos: ['photo.jpg'],
      isAuthenticated: true
    });
  });

  it("populates comment with correct ids", async () => {
      const comment = await Comment.create({
        user_id: testUser._id,
        artwork_id: testArtwork._id,
        text: 'I am a real comment, with real info'
      })

      const populatedComment = await Comment.findById(comment._id)
      .populate('user_id')
      .populate('artwork_id');

      expect(populatedComment.user_id.firstName).toBe('Johnny');
      expect(populatedComment.artwork_id.title).toBe('Millenial child');
    });

})