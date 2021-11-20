import {
  QuickenDataExtractor,
  tables,
  TablesDataRequest,
} from "./QuickenDataExtractor"
import { dataRequestFixture } from "./tests/fixtures/requestsByTable.fixture"
import fs from "fs"

let extractor: QuickenDataExtractor

describe("QuickenDataExtractor module", () => {
  beforeEach(() => {
    extractor = new QuickenDataExtractor(
      "./src/tests/fixtures/data.sqlite3",
    )
  })

  it("should export a class", () => {
    expect(extractor).toBeInstanceOf(QuickenDataExtractor)
  })

  it("should neatly translate Quicken column names to new names", () => {
    const tableNameFixture = "ZSECURITY"
    const rowFixture = {
      Z_PK: 48,
      ZTYPE: 7,
      ZLATESTQUOTEDATE: 618771332.994952,
      ZMODIFICATIONTIMESTAMP: 624927235.425199,
      ZMOSTRECENTQUOTEDOWNLOADTIMESTAMP: 624927235.28393,
      ZASSETCLASSPERCENTAGEDOMESTICBOND: 0,
      ZASSETCLASSPERCENTAGEINTLBOND: 0,
      ZASSETCLASSPERCENTAGEINTLSTOCK: 0,
      ZASSETCLASSPERCENTAGELARGESTOCK: 0,
      ZASSETCLASSPERCENTAGEMONEYMRKT: 0,
      ZASSETCLASSPERCENTAGEOTHER: 0,
      ZASSETCLASSPERCENTAGESMALLSTOCK: 0,
      ZASSETCLASS: "LARGESTOCK",
      ZGUID: "02182756-680E-4C69-800A-4D056C58020B",
      ZISSUETYPE: "CS",
      ZNAME: "INTEL CORP",
      ZTICKER: "INTC",
    }

    const migrated = extractor.tddMigrateColumnNamesForTable(
      tableNameFixture,
      rowFixture,
    )

    expect(migrated).toBeDefined()
  })

  it("should return an object with an array of securities", async () => {
    const testTableName = Object.keys(tables)[4]

    const results = await extractor.fetchAndMigrateQuickenData()
    // console.log('Results: ', results);

    expect(Object.keys(results)).toHaveLength(
      Object.keys(tables).length,
    )
    console.log(results)
    expect(results).toHaveProperty(testTableName)
    expect(results[testTableName]).toHaveProperty("bySecurity")
    expect(results[testTableName]).toHaveProperty("allSecurities")
  })

  it("should gracefully handle errors from database operations", () => {
    test.todo
  })

  test("Text ile of output", async () => {
    const testResults = await extractor.fetchAndMigrateQuickenData()

    const data = JSON.stringify(testResults)
    try {
      fs.writeFileSync("./testOutput.txt", data, "utf8")
    } catch {
      throw new Error("Could not write test file")
    }
  })
})
