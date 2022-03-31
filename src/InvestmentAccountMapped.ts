import { CurrencyCode } from "./@types/CurrencyCode.enum"
import { ZACCOUNTEntity, ZFINANCIALINSTITUTIONEntity } from "./@types/Database"
import BaseMapped from "./BaseMapped"

export enum InvestmentAccountOption {
  ROTHIRA="Roth IRA",
  TRADIRA="Traditional IRA",
  BROKERAGE="Brokerage",
  USTREAS="TreasuryDirect",
  EDUCAT="Educational Savings"
}

export type QuickenAccountData  = {
  ZACCOUNT: ZACCOUNTEntity,
  ZFINANCIALINSTITUTION: ZFINANCIALINSTITUTIONEntity
}

interface InvestmentAccountFromQuicken {
  name: string
  closedDate: Date | null
  currency: CurrencyCode
  type: InvestmentAccountOption
  institutionName: string
  institutionURL: string
}

/**
 * Contains the investment account information mapped from
 * an element (consisting of single ZACCOUNTSEntity and the
 * corresponding ZFINANCIALINSTITUTIONEntity) from Quicken's data.
 */
export default class InvestmentAccountMapped extends BaseMapped<QuickenAccountData> implements InvestmentAccountFromQuicken {
  name: string = ""
  public currency = CurrencyCode.USD
  type = InvestmentAccountOption.BROKERAGE
  closedDate!: Date | null
  readonly quickenData
  institutionName: string = ""
  institutionURL: string = ""

  constructor(quickenData: QuickenAccountData) {
    super(quickenData)
    this.quickenData = quickenData
    this.mapQuickenData(this.quickenData)
  }

  private mapQuickenData = (qData: QuickenAccountData) => {
    const accountData = qData.ZACCOUNT
    const institutionData = qData.ZFINANCIALINSTITUTION
    this.name = this.validatedAsString(accountData.ZNAME)
    this.type = this.mapType(this.validatedAsString(accountData.ZTYPENAME))
    this.currency = this.mapCurrency(this.validatedAsString(accountData.ZCURRENCY))
    this.closedDate = this.validatedAsDate(accountData.ZCLOSEDDATE)
    this.institutionName = this.validatedAsString(institutionData.ZNAME)
    this.institutionURL = this.validatedAsString(institutionData.ZDIRECTCONNECTINFOURL)
  }

  private mapType = (qType: string): InvestmentAccountOption => {
    switch (qType) {
      case "BROKERAGENORMAL":
        return InvestmentAccountOption.BROKERAGE
      case "BROKERAGEEDUCATIONSAVINGS":
        return InvestmentAccountOption.EDUCAT
      case "RETIREMENTIRA":
        return InvestmentAccountOption.TRADIRA
      case "RETIREMENTROTHIRA":
        return InvestmentAccountOption.ROTHIRA
      case "BROKERAGEOTHER":
        return InvestmentAccountOption.USTREAS
      default:
        return InvestmentAccountOption.BROKERAGE
    }
  }
}