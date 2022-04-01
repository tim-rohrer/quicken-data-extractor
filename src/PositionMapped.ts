import { ZPOSITIONEntity, ZSECURITYEntity } from "./@types/Database"
import BaseMapped from "./BaseMapped"

export interface QuickenPositionData {
  ZPOSITION: ZPOSITIONEntity
  ZSECURITY: ZSECURITYEntity
}

interface PositionFromQuicken {
  ticker: string
  account: string
  issueType: unknown
  assetClass: unknown
  readonly quickenData: QuickenPositionData
}

export default class PositionMapped
  extends BaseMapped<QuickenPositionData>
  implements PositionFromQuicken
{
  ticker = ""
  account = ""
  issueType: unknown
  assetClass: unknown
  readonly quickenData

  constructor(quickenData: QuickenPositionData) {
    super(quickenData)
    this.quickenData = quickenData
    this.mapQuickenData(this.quickenData)
  }

  private mapQuickenData = (qData: QuickenPositionData) => {
    // console.log(qData)
    const positionData = qData.ZPOSITION
    const securityData = qData.ZSECURITY
    this.ticker = this.validatedAsString(securityData.ZTICKER)
  }
}
