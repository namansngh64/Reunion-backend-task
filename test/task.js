let chai = require("chai");
let chaiHttp = require("chai-http");
let server = "https://reunion-task-backend.onrender.com";

chai.should();
chai.use(chaiHttp);
let token;
let u_id = "6435315452c4297612aa4d95"; //Another User id for testing follow/unfollow
let p_id = "6436c28f4bb883dea4e30ce1"; //Dummy post id for testing
let d_postId; //PostId to test deletion of post
describe("Reunion Task API", () => {
  describe("POST /api/authenticate", () => {
    it("It should return JWT token", (done) => {
      //! user should exist in database
      const user = {
        email: "a@b.com", // user email
        password: "12345" // user password
      };
      chai
        .request(server)
        .post("/api/authenticate")
        .send(user)
        .end((err, res) => {
          (err === null).should.be.true;
          res.body.should.be.a("object");
          res.body.should.have.property("token");
          token = res.body.token;
          done();
        });
    });
  });
  describe("GET /api/user", () => {
    it("It should return user details", (done) => {
      chai
        .request(server)
        .get("/api/user")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          (err === null).should.be.true;
          res.body.should.be.a("object");
          res.body.should.have.property("name");
          res.body.should.have.property("follower_count");
          res.body.should.have.property("following_count");

          done();
        });
    });
  });
  describe("POST /api/follow/:userId", () => {
    it("It should return a message saying following", (done) => {
      chai
        .request(server)
        .post(`/api/follow/${u_id}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          (err === null).should.be.true;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("POST /api/unfollow/:userId", () => {
    it("It should return a message saying unfollowed", (done) => {
      chai
        .request(server)
        .post(`/api/unfollow/${u_id}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          (err === null).should.be.true;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("POST /api/posts", () => {
    it("It should return created post details", (done) => {
      let post = {
        title: "Post Test",
        description: "Hello! This is my first post"
      };
      chai
        .request(server)
        .post(`/api/posts`)
        .set("Authorization", `Bearer ${token}`)
        .send(post)
        .end((err, res) => {
          (err === null).should.be.true;
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          res.body.should.have.property("title");
          res.body.should.have.property("description");
          res.body.should.have.property("created_time");
          d_postId = res.body.id;
          done();
        });
    });
  });
  describe("DELETE /api/posts/:postId", () => {
    it("It should return post deleted", (done) => {
      chai
        .request(server)
        .delete(`/api/posts/${d_postId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          (err === null).should.be.true;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("POST /api/like/:postId", () => {
    it("It should return post liked", (done) => {
      chai
        .request(server)
        .post(`/api/like/${p_id}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          (err === null).should.be.true;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("POST /api/unlike/:postId", () => {
    it("It should return like removed", (done) => {
      chai
        .request(server)
        .post(`/api/unlike/${p_id}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          (err === null).should.be.true;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("POST /api/comment/:postId", () => {
    it("It should return created comment id", (done) => {
      let comment = { comment: "Nice Post!" };
      chai
        .request(server)
        .post(`/api/comment/${p_id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(comment)
        .end((err, res) => {
          (err === null).should.be.true;
          res.body.should.be.a("object");
          res.body.should.have.property("commentId");
          done();
        });
    });
  });
  describe("GET /api/posts/:postId", () => {
    it("It should return a single post details with likes and comments count", (done) => {
      chai
        .request(server)
        .get(`/api/posts/${p_id}`)
        .end((err, res) => {
          (err === null).should.be.true;
          res.body.should.be.a("object");
          res.body.should.have.property("postId");
          res.body.should.have.property("title");
          res.body.should.have.property("description");
          res.body.should.have.property("user");
          res.body.should.have.property("likesCount");
          res.body.should.have.property("commentsCount");
          done();
        });
    });
  });
  describe("GET /api/all_posts", () => {
    it("It should return all posts of authenticated user", (done) => {
      chai
        .request(server)
        .get(`/api/all_posts`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          (err === null).should.be.true;
          res.body.should.be.a("array");
          res.body.map((p) => {
            p.should.have.property("id");
            p.should.have.property("title");
            p.should.have.property("desc");
            p.should.have.property("created_at");
            p.should.have.property("comments");
            p.comments.should.be.a("array");
            p.should.have.property("likes");
          });
          done();
        });
    });
  });
});
