let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

chai.should();
chai.use(chaiHttp);

describe("Reunion Task API", () => {
  describe("POST /api/signin", (done) => {
    const user = {
      email: "a@b.com",
      password: "12345"
    };
    chai.request(server).post("/api/signin");
  });
});
