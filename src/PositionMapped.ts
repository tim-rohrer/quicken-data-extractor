import { ZACCOUNTEntity, ZPOSITIONEntity, ZSECURITYEntity } from "./@types/Database"
import BaseMapped from "./BaseMapped"

export interface QuickenPositionData {
  ZPOSITION: ZPOSITIONEntity
  ZSECURITY: ZSECURITYEntity
  ZACCOUNT: ZACCOUNTEntity
}

interface PositionFromQuicken {
  name: string
  ticker: string
  issueType: unknown
  assetClass: unknown
  readonly quickenData: QuickenPositionData
}

export default class PositionMapped
  extends BaseMapped<QuickenPositionData>
  implements PositionFromQuicken
{
  name = ""
  ticker = ""
  issueType: unknown
  assetClass: unknown
  readonly quickenData

  constructor(quickenData: QuickenPositionData) {
    super(quickenData)
    this.quickenData = quickenData
    this.mapQuickenData(this.quickenData)
  }

  private mapQuickenData = (qData: QuickenPositionData) => {
    const positionData = qData.ZPOSITION
    const accountData = qData.ZACCOUNT
    const securityData = qData.ZSECURITY
  }
}
