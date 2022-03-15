import DatabaseConstructor, { Database } from "better-sqlite3"
import { SqliteDAO } from "./SqliteDAO"

let db: Database

describe("Sqlite DAO", () => {
  beforeAll(async () => {
    try {
      db = new DatabaseConstructor(":memory:")
      db.prepare(
        `CREATE TABLE test_table (
          id INTEGER PRIMARY KEY,
          name VARCHAR (255), 
          website VARCHAR (255)
        )`,
      ).run()
      db.prepare(
        "INSERT INTO test_table (name, website) VALUES ('NFCU', 'https://navyfcu.org'), ('Schwab', 'https://schwab.com')",
      ).run()
      await SqliteDAO.injectDB(db)
    } catch (error) {
      console.log(error)
    }
  })
  afterAll(() => {
    db.close()
  })

  it("retrieves all rows", () => {
    const result = SqliteDAO.getAll("test_table")

    expect(result.ok).toBe(true)
    expect(result.val).toHaveLength(2)
  })

  it("handles an empty table", () => {
    expect(() => SqliteDAO.getAll("invalid_table")).toThrow()
  })
})
