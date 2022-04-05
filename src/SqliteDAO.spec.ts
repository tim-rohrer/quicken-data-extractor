import DatabaseConstructor, { Database } from "better-sqlite3"
import { SqliteDAO, SqliteDAOGetParams } from "./SqliteDAO"

let db: Database

describe("Sqlite DAO", () => {
  beforeAll(async () => {
    try {
      db = new DatabaseConstructor(":memory:")
      db.prepare(
        `CREATE TABLE institution (
          id INTEGER PRIMARY KEY,
          name VARCHAR (255), 
          website VARCHAR (255)
        )`,
      ).run()
      db.prepare(
        "INSERT INTO institution (name, website) VALUES ('NFCU', 'https://navyfcu.org'), ('Schwab', 'https://schwab.com')",
      ).run()
      db.prepare(
        `CREATE TABLE account (
          id INTEGER PRIMARY KEY,
          name VARCHAR (255),
          balance INTEGER,
          institutionId INTEGER
        )`,
      ).run()
      db.prepare(
        "INSERT INTO account (name, balance, institutionId) VALUES ('Checking', 1004, 1), ('Joint Brokerage', 10500, 2)",
      ).run()
      await SqliteDAO.injectDB(db)
    } catch (error) {
      console.log(error)
    }
  })
  afterAll(() => {
    db.close()
  })
  describe("getAllFromTable", () => {
    it("retrieves all rows from specified table", () => {
      const result = SqliteDAO.getAllFromTable("account")
  
      expect(result.ok).toBe(true)
      expect(result.val).toHaveLength(2)
    })
  
    it("handles an empty table", () => {
      expect(() => SqliteDAO.getAllFromTable("invalid_table")).toThrow()
    })
  })
  describe("getByStatementAndParameters", () => {
    it("retrieves all rows from specified table with select value from lookup", () => {
      const rqstParams: SqliteDAOGetParams = {
        stmt: "SELECT * FROM \"account\" LEFT JOIN \"institution\" ON \"account\".\"institutionId\" = \"institution\".\"id\" WHERE \"account\".\"name\" IN (@val0, @val1)",
        parameterVals: {
          val0: "Checking",
          val1: "Savings"
        }
      }
  
      const result  = SqliteDAO.getByStatementAndParameters(rqstParams)
  
      let rValue: any
      if (result.ok) {
        rValue = result.val[0]
      }
      expect(result.val).toHaveLength(1)
      expect(rValue).toHaveProperty("institution")
    })
  })

})
