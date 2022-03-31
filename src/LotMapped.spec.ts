import LotMapped from "./LotMapped"

let quickenData: any

const quickenLotFixture = {

}

describe("Lot Mapped", () => {
  beforeAll(() => {
    quickenData = quickenLotFixture
  })
  it("instantiates with a property of Quicken Lot Data", () => {
    const testLotMapped = new LotMapped(quickenData)

    expect(testLotMapped).toHaveProperty("quickenData")
  })
  it("contains mapped data elements of name and ticker", () => {
    const testLotMapped = new LotMapped(quickenData)

    expect(testLotMapped.name).toEqual(
      quickenData.ZLOT.ZNAME,
    )
    expect(testLotMapped.ticker).toEqual(
      quickenData.ZLOT.ZTICKER,
    )
  })
  it("contains the type of issue and asset class", () => {
    const testLotMapped = new LotMapped(quickenData)

    expect(testLotMapped.assetClass).toEqual(
      quickenData.ZLOT.ZASSETCLASS,
    )
  })
})
