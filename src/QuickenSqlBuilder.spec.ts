import QuickenSqlBuilder, {
  QuickenSqlBuilderParams,
} from "./QuickenSqlBuilder"

describe("QuickenSqlBuilder", () => {
  it("returns a statement with a LEFT JOIN and placeholders for named parameters", () => {
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
      'SELECT * FROM "account" INNER JOIN "institution" ON "account"."institutionId" = "institution"."id"'

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

    const expectedStatement = 'SELECT * FROM "account"'

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
      'SELECT * FROM "account" LEFT JOIN "institution" ON "account"."institutionId" = "institution"."id" WHERE "account"."name" IN (@val0, @val1) AND "account"."balance" > (@val2)'

    const builder = new QuickenSqlBuilder(rqstParams)

    expect(builder.stmt()).toEqual(expectedStatement)
  })
  it("should handle OR situations", () => {
    test.todo
  })
})
