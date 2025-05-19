const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const app = require("../app")
const request = require("supertest");


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
    .get("/api/articles/1")
    .expect(200)
    .then(({body: {article}}) => {
      expect(article).toMatchObject({
        article_id: 1,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: 11
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

describe("GET /api/articles", () => {
  test("200: Responds with all article objects with correct keys and sorted by created_at descending by default", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: {articles}}) => {
      expect(articles).toBeSortedBy('created_at', {descending: true})

      expect(articles.length).toEqual(13)
      articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
        expect(article).not.toMatchObject({
          body: expect.any(String)
        })
      })
    })
  })
  describe("GET /api/articles sort and order query tests", () => {
    test("200: Can accept a sort_by query without an order query (defaults to descending)", () => {
      return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles).toBeSortedBy('votes', {descending: true})

        expect(articles.length).toEqual(13)
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          })
          expect(article).not.toMatchObject({
            body: expect.any(String)
          })
        })
      })
    })
    test("200: Can accept an order query without a sort_by query (defaults to created_at)", () => {
      return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles).toBeSortedBy('created_at', {ascending: true})

        expect(articles.length).toEqual(13)
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          })
          expect(article).not.toMatchObject({
            body: expect.any(String)
          })
        })
      })
    })
    test("200: Can accept sort and order queries concurrently", () => {
      return request(app)
      .get("/api/articles?sort_by=comment_count&order=asc")
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles).toBeSortedBy('comment_count', {ascending: true})

        expect(articles.length).toEqual(13)
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          })
          expect(article).not.toMatchObject({
            body: expect.any(String)
          })
        })
      })
    })
    test("400: Responds with 400 when the sort query is invalid", () => {
      return request(app)
      .get("/api/articles?sort_by=invalid")
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toEqual("Invalid sort query")
      })
    })
    test("400: Responds with 400 when the order query is invalid", () => {
      return request(app)
      .get("/api/articles?order=invalid")
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toEqual("Invalid order query")
      })
    })
  })
  describe("GET /api/articles topic query tests", () => {
    test("200: Can accept a topic query and responds with articles associated with the provided topic", () => {
      return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles.length).toEqual(1)

        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "cats",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          })
          expect(article).not.toMatchObject({
            body: expect.any(String)
          })
        })
      })
    })
    test("200: Responds with an empty articles array if the given topic is valid but does not have any articles", () => {
      return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles.length).toEqual(0)
      })
    })
    test("200: Can accept sort, order and topic queries concurrently", () => {
      return request(app)
      .get("/api/articles?topic=mitch&sort_by=comment_count&order=asc")
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles).toBeSortedBy('comment_count', {ascending: true})
        expect(articles.length).toEqual(12)

        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          })
          expect(article).not.toMatchObject({
            body: expect.any(String)
          })
        })
      })
    });
    test("400: Responds with 400 when the topic query is invalid", () => {
      return request(app)
      .get("/api/articles?topic=invalid")
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toEqual("Invalid topic query")
      })
    })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with all comment objects corresponding with the article ID", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body: {comments}}) => {
      expect(comments).toBeSortedBy('created_at', {ascending: true})

      expect(comments.length).toEqual(11)

        comments.forEach((comment) => {
          expect(comment.article_id).toEqual(1)
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          })
        })
    })
  })
  test("404: Responds with 404 when provided a valid article_id that is out of range", () => {
    return request(app)
    .get("/api/articles/1000/comments")
    .expect(404)
    .then(({body: {msg}})=> {
      expect(msg).toEqual("No comments with article_id of 1000")
    })
  })
  test("400: Responds with 400 when provided an invalid article_id", () => {
    return request(app)
    .get("/api/articles/invalidArticleID/comments")
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("Bad request")
    })
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the newly added comment", () => {
    const newComment = {
      username: "lurker",
      body: "New comment"
    }

   return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(201)
    .then(({body: {newlyPostedComment}}) => {
       expect(newlyPostedComment).toMatchObject({
        comment_id: expect.any(Number),
        article_id: 1,
        body: "New comment",
        votes: expect.any(Number),
        author: "lurker",
        created_at: expect.any(String)
      })
    })
  })
  test("404: Responds with 404 when attempting to add a comment to a valid article_id that is out of range", () => {
    const newComment = {
      username: "lurker",
      body: "New comment"
    }
    return request(app)
    .post("/api/articles/1000/comments")
    .send(newComment)
    .expect(404)
    .then(({body: {msg}})=> {
      expect(msg).toEqual("No article with article_id of 1000")
    })
  })
  test("404: Responds with 404 when the provided user does not exist", () => {
    const newComment = {
      username: "testUsername",
      body: "New comment"
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(404)
    .then(({body: {msg}})=> {
      expect(msg).toEqual("User does not exist")
    })
  })
  test("400: Responds with 400 when attempting to add a comment to an invalid article_id", () => {
    const newComment = {
      username: "lurker",
      body: "New comment"
    }
    return request(app)
    .post("/api/articles/invalidArticleID/comments")
    .send(newComment)
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("Bad request")
    })
  })
  test("400: Responds with 400 when attempting to add a comment with a post object with invalid data types", () => {
    const newComment = {
      username: "lurker",
      body: 5
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("Bad request")
    })
  })
  test("400: Responds with 400 when attempting to add a comment with a post object with missing data", () => {
    const newComment = {
      username: "lurker",
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("Bad request")
    })
  })
})

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article where votes are increased", () => {
    const newVote = {
      inc_votes: 5
    }

    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(200)
    .then(({body: {updatedArticle}}) => {
      expect(updatedArticle).toMatchObject({
        article_id: 1,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: 105,
        article_img_url: expect.any(String)
      })
    })
  })
  test("200: Responds with the updated article where votes are decreased", () => {
    const newVote = {
      inc_votes: -5
    }

    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(200)
    .then(({body: {updatedArticle}}) => {
      expect(updatedArticle).toMatchObject({
        article_id: 1,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: 95,
        article_img_url: expect.any(String)
      })
    })
  })
  test("404: Responds with 404 when attempting to update a valid article_id that is out of range", () => {
    const newVote = {
      inc_votes: -5
    }
    return request(app)
    .patch("/api/articles/1000")
    .send(newVote)
    .expect(404)
    .then(({body: {msg}})=> {
      expect(msg).toEqual("No article with article_id of 1000")
    })
  })
  test("400: Responds with 400 when attempting to update an invalid article_id", () => {
    const newVote = {
      inc_votes: -5
    }
    return request(app)
    .patch("/api/articles/invalidArticleID")
    .send(newVote)
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("Bad request")
    })
  })
  test("400: Responds with 400 when attempting to update with a patch object with invalid data types", () => {
    const newVote = {
      inc_votes: "10"
    }
    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("Bad request")
    })
  })
  test("400: Responds with 400 when attempting to update with a patch object with missing data", () => {
    const newVote = {
      inc_votes: ''
    }

    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("Bad request")
    })
  })
})

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with 204 and deletes the corresponding comments", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
    
  })
  test("404: Responds with 404 when provided a valid comment_id that is out of range", () => {
    return request(app)
    .delete("/api/comments/1000")
    .expect(404)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("Comment does not exist")
    })
  })
  test("400: Responds with 400 when provided an invalid comment_id", () => {
    return request(app)
    .delete("/api/comments/invalidCommentID")
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("Bad request")
    })
  })
})

describe("GET /api/users", () => {
  test("200: Responds with all user objects with keys of username, name and avatar_url", () => {
   return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body: {users}}) => {
      expect(users.length).toEqual(4)

      users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        })
      })
    })
  })
})

describe("GET /api/users/:username", () => {
  test("200: Responds with the user object corresponding to the provided username", () => {
    return request(app)
    .get("/api/users/icellusedkars")
    .expect(200)
    .then(({body: {user}}) => {
      expect(user).toMatchObject({
        username: "icellusedkars",
        name: "sam",
        avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
      })
    })
  })
  test("404: Responds with 404 when provided an username is not in the database", () => {
    return request(app)
    .get("/api/users/testUsername")
    .expect(404)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("User doesn't exist")
    })
  })
})

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Responds with the updated comment where votes are increased", () => {
    const newVote = {
      inc_votes: 5
    }

    return request(app)
    .patch("/api/comments/1")
    .send(newVote)
    .expect(200)
    .then(({body: {updatedComment}}) => {
      expect(updatedComment).toMatchObject({
        comment_id: 1,
        article_id: expect.any(Number),
        body: expect.any(String),
        votes: 21,
        author: expect.any(String),
        created_at: expect.any(String)
      })
    })
  })
  test("200: Responds with the updated comment where votes are decreased", () => {
    const newVote = {
      inc_votes: -5
    }

    return request(app)
    .patch("/api/comments/1")
    .send(newVote)
    .expect(200)
    .then(({body: {updatedComment}}) => {
      expect(updatedComment).toMatchObject({
        comment_id: 1,
        article_id: expect.any(Number),
        body: expect.any(String),
        votes: 11,
        author: expect.any(String),
        created_at: expect.any(String)
      })
    })
  })
  test("404: Responds with 404 when attempting to update a valid comment_id that is out of range", () => {
    const newVote = {
      inc_votes: -5
    }

    return request(app)
    .patch("/api/comments/1000")
    .send(newVote)
    .expect(404)
    .then(({body: {msg}})=> {
      expect(msg).toEqual("Comment does not exist")
    })
  })
  test("400: Responds with 400 when attempting to update an invalid comment_id", () => {
    const newVote = {
      inc_votes: -5
    }

    return request(app)
    .patch("/api/comments/invalidCommentID")
    .send(newVote)
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("Bad request")
    })
  })
  test("400: Responds with 400 when attempting to update with a patch object with invalid data types", () => {
    const newVote = {
      inc_votes: "10"
    }

    return request(app)
    .patch("/api/comments/1")
    .send(newVote)
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("Bad request")
    })
  })
  test("400: Responds with 400 when attempting to update with a patch object with missing data", () => {
    const newVote = {
    }

    return request(app)
    .patch("/api/comments/1")
    .send(newVote)
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toEqual("Bad request")
    })
  })
})