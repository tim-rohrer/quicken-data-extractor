import sqlite3, { Database } from "sqlite3"
import { SqliteDAO } from "./SqliteDAO"

let db: Database

describe("Sqlite DAO", () => {
  beforeAll(async () => {
    try {
      db = new sqlite3.Database("data.sqlite3")
      await SqliteDAO.injectDB(db)
    } catch (error) {
      console.log(error)
    }
  })
  afterAll(async () => {
    await db.close()
  })

  it("is a function", async () => {
    const result = await SqliteDAO.readAll("ZACCOUNT")
    console.log(result.val)
    expect(SqliteDAO.instance).toBeDefined()
  })
})
