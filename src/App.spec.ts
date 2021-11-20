import request from "supertest"
import app from "./App"
import { QuickenDataExtractor } from "./QuickenDataExtractor"

describe("App module", function () {
  it("should export a function", () => {
    expect(app).toBeInstanceOf(Function)
  })

  it("should return success response with extracted Quicken data", async () => {
    const reqPacket = {
      apiKey: "a12345",
    }

    const res = await request(app)
      .post("/api/fetch")
      .send(reqPacket)
      .set("Accept", "application/json")

    expect(res.status).toBe(200)
    expect(res.body.quickenData).toHaveProperty("ZACCOUNT")
  })
  it("should gracefully handle a request with the incorrect key", async () => {
    const res = await request(app)
      .post("/api/fetch")
      .send({
        apiKey: "invalid",
      })
      .set("Accept", "application/json")
    expect(res.status).toBe(500)
    expect(app).toThrow(Error)
  })
})
