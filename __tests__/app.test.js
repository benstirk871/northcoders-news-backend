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

describe.skip("Non-existant endpoint", () => {
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
  