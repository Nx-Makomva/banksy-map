const request = require("supertest");
const app = require("../../app");
const { default: mongoose } = require("mongoose");

const Artwork = require("../../models/artwork");
const Comment = require("../../models/comments");
jest.mock('../../middleware/upload', () => require('../mocks/multer-s3'));


require("../mongodb_helper");

describe("/artworks", () => {
  beforeEach(async () => {
    await Artwork.deleteMany({});
  });

  describe("POST, when all fields are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post("/artworks")
        .send({
          title: "little man",
          discoveryYear: "2009",
          address: "25, Little Venice, Mountain View, London",
          locationLat: "45",
          locationLng: "-0.45",
          description: "I am real Banksy",
          themeTags: ['animal', 'cool'],
        })

        expect(response.statusCode).toBe(201);
    });

    test("test an artwork is created", async () => {
      await request(app).post("/artworks").send({
        title: "little woman",
        discoveryYear: "2005",
        address: "25, Little Venice, Mountain View, London",
        locationLat: "-45",
        locationLng: "-0.90",
        description: "I am real van gogh",
        themeTags: ['happy', 'hipster'],
      })

      const artworks = await Artwork.find();
      const newArtwork = artworks[artworks.length - 1];

      expect(newArtwork.title).toBe('little woman');
      expect(newArtwork.themeTags).toEqual(['happy', 'hipster']);
      expect(newArtwork.location.coordinates).toEqual([-0.90, -45]);
    });

    describe("POST, when title is missing", () => {
      test("response code is 400", async () => {
        const response = await request(app).post("/artworks").send({
          discoveryYear: "2023",
          address: "25, Little Venice, Mountain View, London",
          locationLat: "-45",
          locationLng: "-0.90",
          description: "I am real van gogh",
          themeTags: ['happy', 'hipster'],
          photos: ['photo.jpg'],
          isAuthenticated: true,
        })

        expect(response.statusCode).toBe(400);
      });

      test("does not create user", async () => {
        await request(app).post("/artworks").send({
          discoveryYear: "2023",
          address: "25, Little Venice, Mountain View, London",
          locationLat: "-45",
          locationLng: "-0.90",
          description: "I am real van gogh",
          themeTags: ['happy', 'hipster'],
          photos: ['photo.jpg'],
          isAuthenticated: true,
        })

        const artworks = await Artwork.find();
        expect(artworks.length).toEqual(0);
        });
    })
  });

describe("GET, a single artwork by id", () => {
      test("returns given artwork based on MongoDB Objectid", async () => {
        const artwork = await Artwork.create({
          title: "little person",
          discoveryYear: "2009",
          address: "25, Little Venice, Mountain View, London",
          location: {
            type: 'Point',
            coordinates: [-0.45, 45]
          },
          description: "I am real Banksy",
          themeTags: ['animal', 'cool'],
          photos: ['photo.jpg'],
          isAuthenticated: false,
        })

        const response = await request(app).get(`/artworks/${artwork._id}`);
        
        expect(response.body.artwork._id).toEqual(artwork._id.toString());
        expect(response.body.artwork.title).toBe('little person');
      })

      test("returns artwork with comments if comments exist", async () => {
        const comment = await Comment.create({
          user_id: new mongoose.Types.ObjectId,
          artwork_id: new mongoose.Types.ObjectId,
          text: "I am a comment"
        })
        const artwork = await Artwork.create({
          title: "boy",
          discoveryYear: "2009",
          address: "25, Little Venice, Mountain View, London",
          location: {
            type: 'Point',
            coordinates: [-0.45, 45]
          },
          description: "I am real Banksy",
          themeTags: ['animal', 'cool'],
          photos: ['photo.jpg'],
          isAuthenticated: false,
          comments: [comment._id]
        })

        const response = await request(app).get(`/artworks/${artwork._id}`);

        const comments = response.body.artwork.comments;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(1)
        expect(response.body.artwork.comments[0].text).toBe('I am a comment');
      })
    })

describe("GET all artworks", () => {
  test("returns all artworks in the collection", async () => {
    await Artwork.create({
      title: "little boy",
      discoveryYear: "2009",
      address: "25, Little Venice, Mountain View, London",
      location: {
        type: 'Point',
        coordinates: [-0.45, 45]
      },
      description: "I am real Banksy",
      themeTags: ['animal', 'hipster'],
      photos: ['photo.jpg'],
      isAuthenticated: false,
    })

    await Artwork.create({
      title: "little girl",
      discoveryYear: "2009",
      address: "25, Little Italy, Mountain View, London",
      location: {
        type: 'Point',
        coordinates: [-0.45, 45]
      },
      description: "I am real art",
      themeTags: ['fancy', 'cool'],
      photos: ['photo.jpg'],
      isAuthenticated: false,
    })

    await Artwork.create({
      title: "little people",
      discoveryYear: "2009",
      address: "25, Little Rome, Mountain View, London",
      location: {
        type: 'Point',
        coordinates: [-0.45, 45]
      },
      description: "I am real van gogh",
      themeTags: ['sparkle', 'yes'],
      photos: ['photo.jpg'],
      isAuthenticated: false,
    })

    const artworksCollection = await Artwork.find();

    const response = await request(app).get("/artworks");
    const allArtworks = response.body.allArtworks;

    const titles = allArtworks.map(art => art.title);

    expect(titles).toContain('little girl');
    expect(titles).toContain('little boy');
    expect(titles).toContain('little people');
    expect(titles.length).toBe(3);

    expect(allArtworks.length).toEqual(artworksCollection.length);
    expect(Array.isArray(allArtworks)).toBe(true);
  })
})

describe("PATCH, update an artwork", () => {
  test("updates artwork fields correctly", async () => {
    const artwork = await Artwork.create({
      title: "old title",
      discoveryYear: "2009",
      address: "25, Old Street, Mountain View, London",
      location: {
        type: 'Point',
        coordinates: [-0.45, 45]
      },
      description: "Old description",
      themeTags: ['boring'],
      photos: ['photo.jpg'],
      isAuthenticated: false,
    });

    const response = await request(app)
      .patch(`/artworks/${artwork._id}`)
      .send({
        title: "new title",
        description: "New and improved description",
        themeTags: ['exciting', 'fresh']
      });

    const updatedArtwork = response.body.updatedArtwork;
    expect(response.statusCode).toBe(200);
    expect(updatedArtwork.title).toBe("new title");
    expect(updatedArtwork.description).toBe("New and improved description");
    expect(updatedArtwork.themeTags).toEqual(['exciting', 'fresh']);
  });
});

describe("DELETE, remove an artwork and its comments", () => {
  test("deletes artwork and associated comments", async () => {
    const comment = await Comment.create({
      user_id: new mongoose.Types.ObjectId(),
      artwork_id: new mongoose.Types.ObjectId(),
      text: "A throwaway comment"
    });

    const artwork = await Artwork.create({
      title: "Temporary piece",
      discoveryYear: "2010",
      address: "25, Nowhere Road, Mountain View, London",
      location: {
        type: 'Point',
        coordinates: [-0.5, 44]
      },
      description: "Soon to be gone",
      themeTags: ['temporary'],
      photos: ['photo.jpg'],
      isAuthenticated: false,
      comments: [comment._id]
    });

    const response = await request(app).delete(`/artworks/${artwork._id}`);

    const deletedArtwork = await Artwork.findById(artwork._id);
    const deletedComment = await Comment.findById(comment._id);

    expect(response.statusCode).toBe(200);
    expect(deletedArtwork).toBeNull();
    expect(deletedComment).toBeNull();
    expect(response.body.message).toBe("Artwork and associated comments successfully deleted");
  });
});
})