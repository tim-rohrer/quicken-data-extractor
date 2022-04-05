import QuickenSqlBuilder, {
  QuickenSqlBuilderParams,
} from "./QuickenSqlBuilder"

describe("QuickenSqlBuilder", () => {
  it.only("returns a statement with a LEFT JOIN and placeholders for named parameters", () => {
    const rqstParams: QuickenSqlBuilderParams = {
      primaryTable: "account",
      joiningOption: [
        {
          type: "LEFT",
          leftTable: "account",
          leftKey: "institutionId",
          rightTable: "institution",
          rightKey: "id",

        },
      ],
      filter: [
        {
          columnName: "name",
          expression: "=",
          values: ["Checking", "Savings"],
        },
      ],
    }
    // eslint-disable-next-line quotes
    const expectedStatement = `SELECT * FROM "account" LEFT JOIN "institution" ON "account"."institutionId" = "institution"."id" WHERE "account"."name" IN (@val0, @val1)`

    const builder = new QuickenSqlBuilder(rqstParams)

    expect(builder.stmt()).toEqual(expectedStatement)
    expect(builder.parameterVals()).toEqual({
      val0: "Checking",
      val1: "Savings",
    })
  })
  it.only("should handle complex joins", () => {
    const rqstParams: QuickenSqlBuilderParams = {
      primaryTable: "ZPOSITION",
      joiningOption: [
        {
          type: "LEFT",
          leftTable: "ZPOSITION",
          leftKey: "ZSECURITY",
          rightTable: "ZSECURITY",
          rightKey: "Z_PK",

        },
        {
          type: "LEFT",
          leftTable: "ZPOSITION",
          leftKey: "Z_PK",
          rightTable: "ZLOT",
          rightKey: "ZPOSITION",

        },
        {
          type: "LEFT",
          leftTable: "ZLOT",
          leftKey: "Z_PK",
          rightTable: "ZLOTMOD",
          rightKey: "ZLOT"
        }
      ],
      filter: []
    }
    const expectedStatement = "SELECT * FROM \"ZPOSITION\" LEFT JOIN \"ZSECURITY\" ON \"ZPOSITION\".\"ZSECURITY\" = \"ZSECURITY\".\"Z_PK\" LEFT JOIN \"ZLOT\" ON \"ZPOSITION\".\"Z_PK\" = \"ZLOT\".\"ZPOSITION\" LEFT JOIN \"ZLOTMOD\" ON \"ZLOT\".\"Z_PK\" = \"ZLOTMOD\".\"ZLOT\""

    const builder = new QuickenSqlBuilder(rqstParams)

    expect(builder.stmt()).toEqual(expectedStatement)
  })
  it("should handle situation where no/empty filter is passed", () => {
    const rqstParams: QuickenSqlBuilderParams = {
      primaryTable: "account",
      joiningOption: [
        {
          primaryKey: "institutionId",
          table: "institution",
          key: "id",
          type: "INNER",
        },
      ],
      filter: [],
    }
    const expectedStatement =
      "SELECT * FROM \"account\" INNER JOIN \"institution\" ON \"account\".\"institutionId\" = \"institution\".\"id\""

    const builder = new QuickenSqlBuilder(rqstParams)

    expect(builder.stmt()).toEqual(expectedStatement)
    expect(builder.parameterVals()).toEqual({})
  })
  it("should handle situation where joining parameters and the filter are empty", () => {
    const rqstParams: QuickenSqlBuilderParams = {
      primaryTable: "account",
      joiningOption: [],
      filter: [],
    }

    const expectedStatement = "SELECT * FROM \"account\""

    const builder = new QuickenSqlBuilder(rqstParams)

    expect(builder.stmt()).toEqual(expectedStatement)
    expect(builder.parameterVals()).toEqual({})
  })
  it("should handle multiple filters", () => {
    const rqstParams: QuickenSqlBuilderParams = {
      primaryTable: "account",
      joiningOption: [
        {
          primaryKey: "institutionId",
          table: "institution",
          key: "id",
          type: "LEFT",
        },
      ],
      filter: [
        {
          columnName: "name",
          expression: "=",
          values: ["Checking", "Savings"],
        },
        {
          columnName: "balance",
          expression: ">",
          values: [1000],
        },
      ],
    }
    const expectedStatement =
      "SELECT * FROM \"account\" LEFT JOIN \"institution\" ON \"account\".\"institutionId\" = \"institution\".\"id\" WHERE \"account\".\"name\" IN (@val0, @val1) AND \"account\".\"balance\" > (@val2)"

    const builder = new QuickenSqlBuilder(rqstParams)

    expect(builder.stmt()).toEqual(expectedStatement)
  })
  it("should handle OR situations", () => {
    test.todo
  })
})
