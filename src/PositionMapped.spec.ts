import PositionMapped from "./PositionMapped"

let quickenData: any

const quickenPositionFixture = {}

describe("Position Mapped", () => {
  beforeAll(() => {
    quickenData = quickenPositionFixture
  })
  it("instantiates with a property of Quicken Position Data", () => {
    const testPositionMapped = new PositionMapped(quickenData)

    expect(testPositionMapped).toHaveProperty("quickenData")
  })
  it("contains mapped data elements of name and ticker", () => {
    const testPositionMapped = new PositionMapped(quickenData)

    expect(testPositionMapped.name).toEqual(
      quickenData.ZPOSITION.ZNAME,
    )
    expect(testPositionMapped.ticker).toEqual(
      quickenData.ZPOSITION.ZTICKER,
    )
  })
  it("contains the type of issue and asset class", () => {
    const testPositionMapped = new PositionMapped(quickenData)

    expect(testPositionMapped.assetClass).toEqual(
      quickenData.ZPOSITION.ZASSETCLASS,
    )
  })
})
