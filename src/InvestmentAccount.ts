import Database from "better-sqlite3"
import { ZACCOUNTEntity } from "./types/Database"

/**
 * InvestmentAccount provides 
 */


type InvestmentAccountType = "Brokerage" | "SingleMutualFund" | "Retirement"

type QuickenDetail = ZACCOUNTEntity 

interface InvestmentAccount extends Account {
  financialInstitution: string
  currency: string
  // quickenConnections?: {
  //   primaryKey: number
  //   activeAccount: boolean
  //   singleMutualFund: boolean
  //   statusTransactionCount: unknown
  //   globalUID: unknown
  // }
  typeName: string
  closed: boolean

}

export default class MyInvestmentAccount implements InvestmentAccount, QuickenDetail {
  constructor() {
  
  }
}