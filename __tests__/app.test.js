const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const app = require("../app")
const request = require("supertest")


beforeEach(() => {
  return seed(data)
})

afterAll(() => {
  return db.end()
})


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("Non-existent endpoint", () => {
  test("404: Responds with an error if the endpoint does not exist", () => {
    return request(app)
    .get("/api/notAnEndpoint")
    .expect(404)
    .then(({body: {msg}}) => {
    expect(msg).toEqual("Endpoint not found")
    })
  })
})

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body: {topics}}) => {
      expect(topics.length).toEqual(3)
      topics.forEach((topic) => {
        expect(topic).toMatchObject({
          description: expect.any(String),
          img_url: expect.any(String)
        })
      })
    })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the corresponding article object", () => {
    return request(app)
    .get("/api/articles/2")
    .expect(200)
    .then(({body: {article}}) => {
      expect(article).toMatchObject({
        article_id: 2,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      })
    })
  })
  test("404: Responds with 404 when provided a valid article_id that is out of range", () => {
    return request(app)
    .get("/api/articles/1000")
    .expect(404)
    .then(({body: {msg}})=> {
      expect(msg).toEqual("No article with article_id of 1000")
    })
  })
  test("400: Responds with 400 when provided an invalid article_id", () => {
    return request(app)
    .get("/api/articles/invalidArticleID")
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("Bad request")
    })
  })
})

