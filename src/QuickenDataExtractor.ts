import { SqliteDAO, SqliteDAOGetParams } from "./SqliteDAO"
import pluralize from "pluralize"
import QuickenSqlBuilder, {
  QuickenSqlBuilderParams,
} from "./QuickenSqlBuilder"
import InvestmentAccountMapped, {
  QuickenAccountData,
} from "./InvestmentAccountMapped"
import SecurityMapped, { QuickenSecurityData } from "./SecurityMapped"
import { QuickenLotData } from "./LotMapped"

export const tables: TablesDataRequest = {
  ZACCOUNT: {
    tableName: "ZACCOUNT",
    quickenColumnNames: [
      "Z_PK",
      "ZACTIVE",
      "ZSINGLEMUTUALFUND",
      "ZSTATUSTRANSACTIONCOUNT",
      "ZFINANCIALINSTITUTION",
      "ZCREATIONTIMESTAMP",
      "ZMODIFICATIONTIMESTAMP",
      "ZCURRENCY",
      "ZGUID",
      "ZNAME",
      "ZNOTES",
      "ZTYPENAME",
      "ZCLOSED",
    ],
    migratedColumnNames: [
      "primaryKey",
      "activeAccount",
      "singleMutualFund",
      "statusTransactionCount",
      "financialInstitution",
      "creationTimestamp",
      "modificationTimestamp",
      "currency",
      "globalUID",
      "accountName",
      "notes",
      "typeName",
      "closed",
    ],
    filters: [
      {
        name: "ZCLOSED",
        expression: "=",
        values: [0],
      },
      {
        name: "ZTYPENAME",
        expression: "=",
        values: [
          "RETIREMENTROTHIRA",
          "BROKERAGENORMAL",
          "BROKERAGEOTHER",
        ],
      },
    ],
    newKey: "accountName",
  },
  ZFINANCIALINSTITUTION: {
    tableName: "ZFINANCIALINSTITUTION",
    quickenColumnNames: [
      "Z_PK",
      "ZLASTUPDATEDFROMFIDIRTIMESTAMP",
      "ZBRANDINGINTULOGINURL",
      "ZDIRECTCONNECTCONTACTPHONE",
      "ZNAME",
    ],
    migratedColumnNames: [
      "primaryKey",
      "lastUpdatedFromFIDIRTimestamp",
      "intuitLoginURL",
      "directConnectContactPhone",
      "financialInstitutionName",
    ],
    filters: [],
    newKey: "financialInstitutionName",
  },
  ZSECURITY: {
    tableName: "ZSECURITY",
    quickenColumnNames: [
      "Z_PK",
      "ZTYPE",
      "ZLATESTQUOTEDATE",
      "ZMODIFICATIONTIMESTAMP",
      "ZMOSTRECENTQUOTEDOWNLOADTIMESTAMP",
      "ZASSETCLASSPERCENTAGEDOMESTICBOND",
      "ZASSETCLASSPERCENTAGEINTLBOND",
      "ZASSETCLASSPERCENTAGEINTLSTOCK",
      "ZASSETCLASSPERCENTAGELARGESTOCK",
      "ZASSETCLASSPERCENTAGEMONEYMRKT",
      "ZASSETCLASSPERCENTAGEOTHER",
      "ZASSETCLASSPERCENTAGESMALLSTOCK",
      "ZASSETCLASS",
      "ZGUID",
      "ZISSUETYPE",
      "ZNAME",
      "ZTICKER",
    ],
    migratedColumnNames: [
      "primaryKey",
      "type",
      "latestQuoteDate",
      "modificationTimestamp",
      "latestQuoteTimestamp",
      "percentageDomesticBond",
      "percentageIntlBond",
      "percentageIntlStock",
      "percentageLargeStock",
      "percentageMoneyMarket",
      "percentageOther",
      "percentageSmallStock",
      "assetClass",
      "globalUID",
      "issueType",
      "name",
      "ticker",
    ],
    filters: [
      {
        name: "ZISSUETYPE",
        expression: "!=",
        values: ["IN"],
      },
    ],
    newKey: "ticker",
  },
  ZLOT: {
    tableName: "ZLOT",
    quickenColumnNames: [
      "Z_PK",
      "ZDELETIONCOUNT",
      "ZPOSITION",
      "ZACQUISITIONDATE",
      "ZCREATIONTIMESTAMP",
      "ZINITIALTRANSACTIONDATE",
      "ZLATESTTRANSACTIONDATE",
      "ZMODIFICATIONTIMESTAMP",
      "ZINITIALCOSTBASIS",
      "ZINITIALUNITS",
      "ZLATESTCOSTBASIS",
      "ZLATESTUNITS",
      "ZGUID",
    ],
    migratedColumnNames: [
      "primaryKey",
      "deletionCount",
      "position",
      "acquisitionDate",
      "creationTimestamp",
      "initialTransactionDate",
      "latestTransactionDate",
      "modificationTimestamp",
      "initialCostBasis",
      "initialUnits",
      "latestCostBasis",
      "latestUnits",
      "globalUID",
    ],
    newKey: "position",
  },
  ZPOSITION: {
    tableName: "ZPOSITION",
    quickenColumnNames: [
      "Z_PK",
      "ZCOSTBASISALGORITHM",
      "ZDELETIONCOUNT",
      "ZQUICKENID",
      "ZTYPE",
      "ZACCOUNT",
      "ZSECURITY",
      "ZCREATIONTIMESTAMP",
      "ZMODIFICATIONTIMESTAMP",
      "ZGUID",
      "ZUNIQUEID",
      "ZUNIQUEIDTYPE",
    ],
    migratedColumnNames: [
      "primaryKey",
      "costBasisAlgorithm",
      "deletionCount",
      "quickenID",
      "type",
      "account",
      "security",
      "creationTimestamp",
      "modificationTimestamp",
      "globalUID",
      "uniqueID",
      "uniqueIDType",
    ],
    filters: [
      {
        name: "ZSECURITY",
        expression: "NOT",
        values: [null],
      },
    ],
    newKey: "security",
  },
}

export interface Row {
  col: string
}

export type QuickenTableName =
  | "ZACCOUNT"
  | "ZFINANCIALINSTITUTION"
  | "ZPOSITION"
  | "ZSECURITY"
  | "ZSECURITYQUOTE"
  | "ZSECURITYQUOTEDETAIL"
  | "ZLOT"
  | "ZLOTMOD"
  | "ZLOTASSIGNMENT"
  | "ZPOSITION"
  | "ZFIPOSITION"
  | "ZFITRANSACTION"
  | "ZTRANSACTION"

export type RowFilter = {
  name: string
  expression: string
  values: Array<string | number | null>
}

export interface TableColsMap {
  tableName: QuickenTableName
  quickenColumnNames: Array<string>
  migratedColumnNames: Array<string>
  filters?: Array<RowFilter>
  newKey: string
}

export type TablesDataRequest = {
  [x: string]: TableColsMap
}

export class QuickenDataExtractor {
  private static fetchFromQuicken<T>(
    params: QuickenSqlBuilderParams,
  ) {
    const builder = new QuickenSqlBuilder(params)
    const getParams: SqliteDAOGetParams = {
      stmt: builder.stmt(),
      parameterVals: builder.parameterVals(),
    }
    const results =
      SqliteDAO.getByStatementAndParameters<T>(getParams)
    if (results.ok) {
      return results.val
    } else {
      return []
    }
  }

  static getInvestmentAccounts = () => {
    const params: QuickenSqlBuilderParams = {
      primaryTable: "ZACCOUNT",
      primaryKey: "ZFINANCIALINSTITUTION",
      joiningTable: "ZFINANCIALINSTITUTION",
      joiningKey: "Z_PK",
      joiningType: "LEFT",
      filter: [
        {
          columnName: "ZTYPENAME",
          expression: "=",
          values: [
            "RETIREMENTROTHIRA",
            "BROKERAGENORMAL",
            "BROKERAGEOTHER",
          ],
        },
      ],
    }
    const accounts =
      QuickenDataExtractor.fetchFromQuicken<QuickenAccountData>(
        params,
      )
    const accountsMapped: string[] = []
    accounts.forEach((account) => {
      const x = new InvestmentAccountMapped(account)
      accountsMapped.push(JSON.stringify(x))
    })
    return accountsMapped
  }

  static getSecurities = () => {
    const params: QuickenSqlBuilderParams = {
      primaryTable: "ZSECURITY",
      primaryKey: "",
      joiningTable: "",
      joiningKey: "",
      joiningType: "INNER",
      filter: [
        {
          columnName: "ZISSUETYPE",
          expression: "<>",
          values: ["IN"],
        },
      ],
    }
    const securities =
      QuickenDataExtractor.fetchFromQuicken<QuickenSecurityData>(
        params,
      )
    const securitiesMapped: string[] = []
    securities.forEach((security) => {
      const x = new SecurityMapped(security)
      securitiesMapped.push(JSON.stringify(x))
    })
    return securitiesMapped
  }

  static getLots = () => {
    const params: QuickenSqlBuilderParams = {
      primaryTable: "ZLOT",
      primaryKey: "",
      joiningTable: "",
      joiningKey: "",
      joiningType: "INNER",
      filter: [],
    }
    const lots =
      QuickenDataExtractor.fetchFromQuicken<QuickenLotData>(params)
  }
}
