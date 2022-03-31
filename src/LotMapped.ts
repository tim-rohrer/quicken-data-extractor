import { ZLOTEntity } from "./@types/Database"
import BaseMapped from "./BaseMapped"

export interface QuickenLotData {
  ZLOT: ZLOTEntity
}

interface LotFromQuicken {
  name: string
  ticker: string
  issueType: unknown
  assetClass: unknown
  readonly quickenData: QuickenLotData
}

export default class LotMapped
  extends BaseMapped<QuickenLotData>
  implements LotFromQuicken
{
  name = ""
  ticker = ""
  issueType: unknown
  assetClass: unknown
  readonly quickenData

  constructor(quickenData: QuickenLotData) {
    super(quickenData)
    this.quickenData = quickenData
    this.mapQuickenData(this.quickenData)
  }

  private mapQuickenData = (qData: QuickenLotData) => {
    const lotData = qData.ZLOT
    this.name = this.validatedAsString(lotData.ZNAME)
    this.ticker = this.validatedAsString(lotData.ZTICKER)
    this.issueType = this.validatedAsString(lotData.ZISSUETYPE)
    this.assetClass = this.validatedAsString(lotData.ZASSETCLASS)
  }
}
