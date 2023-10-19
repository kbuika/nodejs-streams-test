const { expect } = require("chai")
const request = require("supertest")
const sinon = require("sinon")
const app = require("../app/index") // Import your Express app
const mongoose = require("mongoose")

describe("CSV Download Route", () => {
  let server
  const sandbox = sinon.createSandbox()

  before(async () => {
    if (mongoose.connection.readyState !== 1) {
      // check mongodb connection state
      await mongoose.connect(process.env.MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    }
    if (!server) {
      server = app
    }
  })

  after(async () => {
    await mongoose.connection.close()
    sandbox.restore()
  })

  it("should download the CSV file with subscriptions costing $50 or more", function (done) {
    request(app)
      .get("/api/v1/generate/csv")
      .expect(
        "Content-Disposition",
        "attachment; filename=subscriptions_over_or_equal_to_50.csv"
      )
      .expect("Content-Type", "text/csv")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })

  it("should return plans with subscription counts", async () => {
    const res = await request(app).get("/api/v1/plans/breakdown")
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an("array")
    expect(res.body).to.have.lengthOf(5)
    expect(res.body[0]).to.have.property("name", "Platinum")
    expect(res.body[0]).to.have.property("subscriptionCount", 5000)
    expect(res.body[1]).to.have.property("name", "Gold")
    expect(res.body[1]).to.have.property("subscriptionCount", 8000)
    expect(res.body[2]).to.have.property("name", "Silver")
    expect(res.body[2]).to.have.property("subscriptionCount", 12000)
    expect(res.body[3]).to.have.property("name", "Bronze")
    expect(res.body[3]).to.have.property("subscriptionCount", 7000)
    expect(res.body[4]).to.have.property("name", "Freemium")
    expect(res.body[4]).to.have.property("subscriptionCount", 500)
  })
})
