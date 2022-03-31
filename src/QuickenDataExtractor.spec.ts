import DatabaseConstructor, { Database } from "better-sqlite3"
import { SqliteDAO } from "./SqliteDAO"
import { QuickenDataExtractor } from "./QuickenDataExtractor"
let db: Database

describe("QuickenDataExtractor module", () => {
  beforeAll(async () => {
    const dbFileName = "data.sqlite3"
    db = new DatabaseConstructor(
      dbFileName, 
      {readonly: true}
    )
    await SqliteDAO.injectDB(db)
  })

  afterAll(() => {
    db.close()
  })
  describe("getInvestmentAccounts", () => {
    it("should return investment accounts serialized in an array", () => {
      const accountsData = QuickenDataExtractor.getInvestmentAccounts()

      expect(accountsData.length).toBeGreaterThan(0)
      expect(accountsData).toBeInstanceOf(Array)
    })
  })
  describe("getSecurities", () => {
    it("should return all securities serialized in an array", () => {
      const securitiesData = QuickenDataExtractor.getSecurities()

      expect(securitiesData.length).toBeGreaterThan(0)
      expect(securitiesData).toBeInstanceOf(Array)
    })
  })
  describe("getPositions", () => {
    it.only("should return all Positions serialized in an array", () => {
      const positionsData = QuickenDataExtractor.getPositions()

      console.log(JSON.parse(positionsData[0]))
      expect(positionsData.length).toBeGreaterThan(0)
      expect(positionsData).toBeInstanceOf(Array)
    })
  })
  describe("getLots", () => {
    it("should return all lots serialized in an array", () => {
      const lotsData = QuickenDataExtractor.getLots()

      console.log(JSON.parse(lotsData[0]))
      expect(lotsData.length).toBeGreaterThan(0)
      expect(lotsData).toBeInstanceOf(Array)
    })
  })
})
