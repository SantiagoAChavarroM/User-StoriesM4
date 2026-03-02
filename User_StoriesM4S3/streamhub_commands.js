// StreamHub — User Story Week 3 (MongoDB)
// Deliverable — All mongosh commands, ordered by phase

// ======================================
// PHASE 0: Setup
// ======================================
// Select DB and verify context/emptiness
//use streamhub
db.getName()
//show collections
db.getCollectionNames()

// ======================================
// PHASE 1: Domain design
// ======================================
// Model B: reviews stored in a separate collection (scales + easier aggregations)
db.runCommand({ hello: 1 })
print("MODEL = B (users, contents, reviews)")

// Minimal schema (reference)
// users:    { name, email, plan, country, createdAt, watchCount, isActive }
// contents: { type, title, genres[], durationMin?, releaseYear, views, seasons?[], createdAt }
// reviews:  { userEmail, contentId, rating, comment, createdAt, isSpam }

// ======================================
// PHASE 2: Seed data (insertMany)
// ======================================
// Users (min 6)
db.users.insertMany([
  { name: "Ana Torres",   email: "ana@streamhub.com",    plan: "basic",   country: "CO", createdAt: ISODate("2026-03-01T00:00:00Z"), watchCount: 7,  isActive: true  },
  { name: "Luis Gómez",   email: "luis@streamhub.com",   plan: "premium", country: "CO", createdAt: ISODate("2026-02-20T00:00:00Z"), watchCount: 12, isActive: true  },
  { name: "Marta Ríos",   email: "marta@streamhub.com",  plan: "basic",   country: "MX", createdAt: ISODate("2026-02-15T00:00:00Z"), watchCount: 3,  isActive: true  },
  { name: "David Lee",    email: "david@streamhub.com",  plan: "premium", country: "US", createdAt: ISODate("2026-01-10T00:00:00Z"), watchCount: 20, isActive: true  },
  { name: "Sofía Pérez",  email: "sofia@streamhub.com",  plan: "basic",   country: "AR", createdAt: ISODate("2026-02-28T00:00:00Z"), watchCount: 0,  isActive: false },
  { name: "Camila Núñez", email: "camila@streamhub.com", plan: "premium", country: "CL", createdAt: ISODate("2026-03-01T00:00:00Z"), watchCount: 6,  isActive: true  }
])
db.users.countDocuments()
db.users.findOne({}, { _id: 0, name: 1, email: 1, plan: 1, watchCount: 1, isActive: 1 })

// Contents (min 10; mix movies + series; keep insertedIds for review refs)
const contents = [
  { type: "movie",  title: "Night Run",        genres: ["Action","Thriller"], durationMin: 128, releaseYear: 2023, views: 1200, seasons: null, createdAt: ISODate("2026-03-01T00:00:00Z") },
  { type: "movie",  title: "Silent Harbor",    genres: ["Drama","Mystery"],   durationMin: 142, releaseYear: 2022, views: 900,  seasons: null, createdAt: ISODate("2026-03-01T00:00:00Z") },
  { type: "movie",  title: "Pixel Heist",      genres: ["Comedy","Tech"],     durationMin: 98,  releaseYear: 2024, views: 3200, seasons: null, createdAt: ISODate("2026-03-01T00:00:00Z") },
  { type: "movie",  title: "Andes Story",      genres: ["Documentary"],       durationMin: 76,  releaseYear: 2021, views: 450,  seasons: null, createdAt: ISODate("2026-03-01T00:00:00Z") },
  { type: "movie",  title: "Cosmic Drift",     genres: ["Sci-Fi","Adventure"],durationMin: 121, releaseYear: 2020, views: 5100, seasons: null, createdAt: ISODate("2026-03-01T00:00:00Z") },

  { type: "series", title: "Code Masters",     genres: ["Drama","Tech"],      durationMin: null, releaseYear: 2024, views: 5400,
    seasons: [{ seasonNumber: 1, episodes: 8 }, { seasonNumber: 2, episodes: 10 }], createdAt: ISODate("2026-03-01T00:00:00Z") },

  { type: "series", title: "Medellín Nights",  genres: ["Crime","Thriller"],  durationMin: null, releaseYear: 2023, views: 4100,
    seasons: [{ seasonNumber: 1, episodes: 6 }], createdAt: ISODate("2026-03-01T00:00:00Z") },

  { type: "series", title: "Kitchen Wars",     genres: ["Reality","Comedy"],  durationMin: null, releaseYear: 2019, views: 2500,
    seasons: [{ seasonNumber: 1, episodes: 12 }, { seasonNumber: 2, episodes: 12 }, { seasonNumber: 3, episodes: 10 }], createdAt: ISODate("2026-03-01T00:00:00Z") },

  { type: "series", title: "Hidden Codes",     genres: ["Mystery","Sci-Fi"],  durationMin: null, releaseYear: 2021, views: 3800,
    seasons: [{ seasonNumber: 1, episodes: 10 }], createdAt: ISODate("2026-03-01T00:00:00Z") },

  { type: "series", title: "Ocean Planet",     genres: ["Documentary"],       durationMin: null, releaseYear: 2018, views: 800,
    seasons: [{ seasonNumber: 1, episodes: 5 }], createdAt: ISODate("2026-03-01T00:00:00Z") }
];

const ins = db.contents.insertMany(contents);
const ids = Object.values(ins.insertedIds);

// Content id handles for review inserts (c1..c10)
const c1=ids[0], c2=ids[1], c3=ids[2], c4=ids[3], c5=ids[4], c6=ids[5], c7=ids[6], c8=ids[7], c9=ids[8], c10=ids[9];

ins
db.contents.countDocuments()
db.contents.findOne({}, { title: 1, type: 1, genres: 1, durationMin: 1, views: 1, seasons: 1 })

// Reviews (min 20; includes spam cases for deleteMany later)
db.reviews.insertMany([
  { userEmail: "ana@streamhub.com",    contentId: c1,  rating: 5, comment: "Acción brutal, gran ritmo",         createdAt: ISODate("2026-03-01T10:00:00Z"), isSpam: false },
  { userEmail: "luis@streamhub.com",   contentId: c1,  rating: 4, comment: "Buena, aunque predecible",          createdAt: ISODate("2026-03-01T11:00:00Z"), isSpam: false },
  { userEmail: "marta@streamhub.com",  contentId: c1,  rating: 3, comment: "Regular, esperaba más",             createdAt: ISODate("2026-03-01T12:00:00Z"), isSpam: false },

  { userEmail: "david@streamhub.com",  contentId: c2,  rating: 5, comment: "Misterio top, final wow",           createdAt: ISODate("2026-03-01T13:00:00Z"), isSpam: false },
  { userEmail: "camila@streamhub.com", contentId: c2,  rating: 4, comment: "Drama sólido y tenso",              createdAt: ISODate("2026-03-01T14:00:00Z"), isSpam: false },

  { userEmail: "ana@streamhub.com",    contentId: c3,  rating: 4, comment: "Muy divertida, estilo tech",        createdAt: ISODate("2026-03-01T15:00:00Z"), isSpam: false },
  { userEmail: "luis@streamhub.com",   contentId: c3,  rating: 2, comment: "No me gustó, chistes flojos",       createdAt: ISODate("2026-03-01T16:00:00Z"), isSpam: false },

  { userEmail: "marta@streamhub.com",  contentId: c4,  rating: 5, comment: "Documental hermoso",                createdAt: ISODate("2026-03-01T17:00:00Z"), isSpam: false },
  { userEmail: "sofia@streamhub.com",  contentId: c4,  rating: 1, comment: "spam link barato!!!",               createdAt: ISODate("2026-03-01T18:00:00Z"), isSpam: true  },

  { userEmail: "david@streamhub.com",  contentId: c5,  rating: 4, comment: "Sci-fi muy buena",                  createdAt: ISODate("2026-03-01T19:00:00Z"), isSpam: false },
  { userEmail: "camila@streamhub.com", contentId: c5,  rating: 5, comment: "Aventura espacial épica",           createdAt: ISODate("2026-03-01T20:00:00Z"), isSpam: false },

  { userEmail: "ana@streamhub.com",    contentId: c6,  rating: 5, comment: "Serie de código 10/10",             createdAt: ISODate("2026-03-02T09:00:00Z"), isSpam: false },
  { userEmail: "luis@streamhub.com",   contentId: c6,  rating: 4, comment: "Buen drama tech",                   createdAt: ISODate("2026-03-02T10:00:00Z"), isSpam: false },
  { userEmail: "david@streamhub.com",  contentId: c6,  rating: 3, comment: "Ok, pero lenta",                    createdAt: ISODate("2026-03-02T11:00:00Z"), isSpam: false },

  { userEmail: "camila@streamhub.com", contentId: c7,  rating: 4, comment: "Thriller oscuro, me gustó",         createdAt: ISODate("2026-03-02T12:00:00Z"), isSpam: false },
  { userEmail: "marta@streamhub.com",  contentId: c7,  rating: 2, comment: "No conecté con la historia",        createdAt: ISODate("2026-03-02T13:00:00Z"), isSpam: false },

  { userEmail: "ana@streamhub.com",    contentId: c8,  rating: 3, comment: "Reality entretenido",               createdAt: ISODate("2026-03-02T14:00:00Z"), isSpam: false },
  { userEmail: "sofia@streamhub.com",  contentId: c8,  rating: 1, comment: "spam spam spam!!!",                 createdAt: ISODate("2026-03-02T15:00:00Z"), isSpam: true  },

  { userEmail: "luis@streamhub.com",   contentId: c9,  rating: 5, comment: "Misterio y sci-fi brutal",          createdAt: ISODate("2026-03-02T16:00:00Z"), isSpam: false },
  { userEmail: "david@streamhub.com",  contentId: c9,  rating: 4, comment: "Buen suspenso",                     createdAt: ISODate("2026-03-02T17:00:00Z"), isSpam: false },

  { userEmail: "camila@streamhub.com", contentId: c10, rating: 5, comment: "Documental excelente",              createdAt: ISODate("2026-03-02T18:00:00Z"), isSpam: false }
])
db.reviews.countDocuments()
db.reviews.findOne({}, { userEmail: 1, contentId: 1, rating: 1, isSpam: 1 })

// Sanity checks (counts + samples)
db.users.countDocuments()
db.contents.countDocuments()
db.reviews.countDocuments()
db.users.findOne()
db.contents.findOne()
db.reviews.findOne()

// ======================================
// PHASE 3: find() queries with operators
// ======================================

// Q1 ($gt): movies longer than 120 min
db.contents.find(
  { type: "movie", durationMin: { $gt: 120 } },
  { _id: 0, title: 1, durationMin: 1, genres: 1 }
)

// Q2 ($lt): low-view contents
db.contents.find(
  { views: { $lt: 1000 } },
  { _id: 0, title: 1, type: 1, views: 1, genres: 1 }
).sort({ views: 1 })

// Q3 ($eq): premium users
db.users.find(
  { plan: { $eq: "premium" } },
  { _id: 0, name: 1, email: 1, plan: 1 }
)

// Q4 ($in): contents in Documentary or Sci-Fi
db.contents.find(
  { genres: { $in: ["Documentary", "Sci-Fi"] } },
  { _id: 0, title: 1, type: 1, genres: 1 }
)

// Q5 ($and): movies with views > 1000 and duration < 130
db.contents.find(
  { $and: [ { type: "movie" }, { views: { $gt: 1000 } }, { durationMin: { $lt: 130 } } ] },
  { _id: 0, title: 1, views: 1, durationMin: 1 }
).sort({ views: -1 })

// Q6 ($or): inactive users OR users with 0 watchCount
db.users.find(
  { $or: [ { isActive: false }, { watchCount: { $eq: 0 } } ] },
  { _id: 0, name: 1, email: 1, isActive: 1, watchCount: 1 }
)

// Q7 ($regex): title search (case-insensitive)
db.contents.find(
  { title: { $regex: "code", $options: "i" } },
  { _id: 0, title: 1, type: 1, genres: 1 }
)

// Q8 (combined): rating >= 4 and comment contains "bu" or "brutal"
db.reviews.find(
  {
    $and: [
      { rating: { $gte: 4 } },
      { $or: [ { comment: { $regex: "bu", $options: "i" } }, { comment: { $regex: "brutal", $options: "i" } } ] }
    ]
  },
  { _id: 0, userEmail: 1, rating: 1, comment: 1 }
)

// ======================================
// PHASE 4: Updates and deletes
// ======================================
// UpdateOne #1: edit a specific review (before/after)
db.reviews.find(
  { userEmail: "luis@streamhub.com", contentId: c1 },
  { _id: 1, userEmail: 1, rating: 1, comment: 1, isSpam: 1 }
)
db.reviews.updateOne(
  { userEmail: "luis@streamhub.com", contentId: c1 },
  { $set: { rating: 5, comment: "Excelente, mejor de lo que esperaba" } }
)
db.reviews.find(
  { userEmail: "luis@streamhub.com", contentId: c1 },
  { _id: 0, userEmail: 1, rating: 1, comment: 1 }
)

// UpdateOne #2: upgrade a user plan (before/after)
db.users.find(
  { email: "ana@streamhub.com" },
  { _id: 0, name: 1, email: 1, plan: 1 }
)
db.users.updateOne(
  { email: "ana@streamhub.com" },
  { $set: { plan: "premium" } }
)
db.users.find(
  { email: "ana@streamhub.com" },
  { _id: 0, name: 1, email: 1, plan: 1 }
)

// UpdateMany: flag spam by regex (before/after)
db.reviews.countDocuments({ comment: { $regex: "spam", $options: "i" } })
db.reviews.updateMany(
  { comment: { $regex: "spam", $options: "i" } },
  { $set: { isSpam: true } }
)
db.reviews.find(
  { isSpam: true },
  { _id: 0, userEmail: 1, rating: 1, comment: 1, isSpam: 1 }
)

// DeleteOne: remove a single review by _id (ObjectId required)
db.reviews.find(
  { userEmail: "luis@streamhub.com", contentId: c3 },
  { _id: 1, userEmail: 1, rating: 1, comment: 1 }
)
db.reviews.deleteOne({ _id: ObjectId("69a4e74b4ba8a20c478563c7") })
db.reviews.find(
  { userEmail: "luis@streamhub.com", contentId: c3 },
  { _id: 1, userEmail: 1, rating: 1, comment: 1 }
)

// DeleteMany: remove all spam reviews (before/after)
db.reviews.countDocuments({ isSpam: true })
db.reviews.deleteMany({ isSpam: true })
db.reviews.countDocuments({ isSpam: true })

// ======================================
// PHASE 5: Indexes
// ======================================
// title text: faster title search
// genres: faster genre filters ($in) and genre-based reporting
// userEmail+createdAt: faster per-user review timelines
// contentId+rating: faster per-content review metrics
db.contents.createIndex({ title: "text" })
db.contents.createIndex({ genres: 1 })
db.reviews.createIndex({ userEmail: 1, createdAt: -1 })
db.reviews.createIndex({ contentId: 1, rating: -1 })
db.contents.getIndexes()
db.reviews.getIndexes()

// ======================================
// PHASE 6: Aggregations (reports)
// ======================================
// Agg #1: Top genres by average rating (joins reviews -> contents)
db.reviews.aggregate([
  { $match: { isSpam: false } },
  { $lookup: { from: "contents", localField: "contentId", foreignField: "_id", as: "content" } },
  { $unwind: "$content" },
  { $unwind: "$content.genres" },
  { $group: { _id: "$content.genres", avgRating: { $avg: "$rating" }, reviewsCount: { $sum: 1 } } },
  { $sort: { avgRating: -1, reviewsCount: -1 } },
  { $project: { _id: 0, genre: "$_id", avgRating: { $round: ["$avgRating", 2] }, reviewsCount: 1 } },
  { $limit: 5 }
])

// Agg #2: Top contents by review volume + average rating
db.reviews.aggregate([
  { $match: { isSpam: false } },
  { $group: { _id: "$contentId", reviewsCount: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
  { $sort: { reviewsCount: -1, avgRating: -1 } },
  { $lookup: { from: "contents", localField: "_id", foreignField: "_id", as: "content" } },
  { $unwind: "$content" },
  { $project: { _id: 0, title: "$content.title", type: "$content.type", genres: "$content.genres", reviewsCount: 1, avgRating: { $round: ["$avgRating", 2] } } },
  { $limit: 5 }
])