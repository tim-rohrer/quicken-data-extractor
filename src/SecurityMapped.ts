import { ZSECURITYEntity } from "./@types/Database";
import BaseMapped from "./BaseMapped";

export interface QuickenSecurityData {
  ZSECURITY: ZSECURITYEntity
}

interface SecurityFromQuicken {
  name: string
  ticker: string
  issueType: unknown
  assetClass: unknown
  readonly quickenData: QuickenSecurityData
}

export default class SecurityMapped extends BaseMapped<QuickenSecurityData> implements SecurityFromQuicken {
  name: string = ""
  ticker: string = ""
  issueType: unknown
  assetClass: unknown
  readonly quickenData

  constructor(quickenData: QuickenSecurityData) {
    super(quickenData)
    this.quickenData = quickenData
    this.mapQuickenData(this.quickenData)
  }

  private mapQuickenData = (qData: QuickenSecurityData) => {
    const securityData = qData.ZSECURITY
    this.name = this.validatedAsString(securityData.ZNAME)
    this.ticker = this.validatedAsString(securityData.ZTICKER)
    this.issueType = this.validatedAsString(securityData.ZISSUETYPE)
    this.assetClass = this.validatedAsString(securityData.ZASSETCLASS)
  }
  
}