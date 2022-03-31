import SecurityMapped from "./SeurityMapped"

let quickenData: any

const quickenSecurityFixture = {
  ZSECURITY: {
    Z_PK: 74,
    Z_ENT: 46,
    Z_OPT: 223,
    ZCOSTBASISALGORITHM: 0,
    ZDEBTRATINGTYPE: 0,
    ZDEBTTYPE: 0,
    ZDELETIONCOUNT: 0,
    ZHIDEINLISTS: 0,
    ZINTERESTFREQUENCYTYPE: 0,
    ZQUICKENID: 74,
    ZSHOULDDOWNLOADQUOTES: 1,
    ZTAXFREE: null,
    ZTYPE: 7,
    ZWATCHLIST: 0,
    ZCOUPONMATURITYDATE: 0,
    ZCREATIONTIMESTAMP: 662059433.868077,
    ZDEBTCALLDATE: null,
    ZDEBTMATURITYDATE: null,
    ZEXPIREDATE: 0,
    ZLATESTQUOTEDATE: 669138461.008569,
    ZMODIFICATIONTIMESTAMP: 669138461.008596,
    ZMOSTRECENTQUOTEDOWNLOADTIMESTAMP: 669138460.765803,
    ZASSETCLASSPERCENTAGEDOMESTICBOND: 0,
    ZASSETCLASSPERCENTAGEINTLBOND: 0,
    ZASSETCLASSPERCENTAGEINTLSTOCK: 0,
    ZASSETCLASSPERCENTAGELARGESTOCK: 0,
    ZASSETCLASSPERCENTAGEMONEYMRKT: 0,
    ZASSETCLASSPERCENTAGEOTHER: 0,
    ZASSETCLASSPERCENTAGESMALLSTOCK: 0,
    ZBACKLOADFEERATE: 0,
    ZCOUPONRATE: 0,
    ZDEBTMATURITYRATE: 0,
    ZFACEVALUEUNITPRICE: 0,
    ZLATESTCLOSINGPRICE: 0,
    ZLATESTPRICECHANGE: 0,
    ZLATESTPRICECHANGEPERCENT: 0,
    ZSHARESPERCONTRACT: 0,
    ZSTRIKEPRICE: 0,
    ZASSETCLASS: 'SMALLSTOCK',
    ZDATASOURCE: null,
    ZGOALSTRING: null,
    ZGUID: '2446814D-A218-4A75-B8C5-F1046E62F909',
    ZISSUETYPE: 'CS',
    ZNAME: 'BIOLIFE SOLUTIONS',
    ZOPTIONTYPE: '0',
    ZSYNCID: '306250513350253057',
    ZTICKER: 'BLFS',
    ZASSETMIXTUREDATAISUSERDEFINED: null,
    ZASSETCLASSPERCENTAGECASH: 0
  }
}

describe("Security Mapped", () => {
  beforeAll(() => {
    quickenData = quickenSecurityFixture
  })
  it("instantiates with a property of Quicken Security Data", () => {
    const testSecurityMapped = new SecurityMapped(quickenData)

    expect(testSecurityMapped).toHaveProperty("quickenData")
  })
  it("contains mapped data elements of name and ticker", () => {
    const testSecurityMapped = new SecurityMapped(quickenData)

    expect(testSecurityMapped.name).toEqual(quickenData.ZSECURITY.ZNAME)
    expect(testSecurityMapped.ticker).toEqual(quickenData.ZSECURITY.ZTICKER)    
  })
  it("contains the type of issue and asset class", () => {
    const testSecurityMapped = new SecurityMapped(quickenData)

    expect(testSecurityMapped.assetClass).toEqual(quickenData.ZSECURITY.ZASSETCLASS)
  })
})