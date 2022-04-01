import { SqliteDAO, SqliteDAOGetParams } from "./SqliteDAO"
import pluralize from "pluralize"
import QuickenSqlBuilder, {
  QuickenSqlBuilderParams,
} from "./QuickenSqlBuilder"
import InvestmentAccountMapped, {
  QuickenAccountData,
} from "./InvestmentAccountMapped"
import SecurityMapped, { QuickenSecurityData } from "./SecurityMapped"
import LotMapped, { QuickenLotData } from "./LotMapped"
import PositionMapped, { QuickenPositionData } from "./PositionMapped"

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
    console.log(getParams)
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
      joiningOption: [
        {
          primaryKey: "ZFINANCIALINSTITUTION",
          table: "ZFINANCIALINSTITUTION",
          key: "Z_PK",
          type: "LEFT",
        },
      ],
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
      joiningOption: [],
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

  static getPositions = () => {
    const params: QuickenSqlBuilderParams = {
      primaryTable: "ZPOSITION",
      // joiningOption: [],
      joiningOption: [
        {
          primaryKey: "ZSECURITY",
          table: "ZSECURITY",
          key: "Z_PK",
          type: "LEFT",
        },
        {
          primaryKey: "Z_PK",
          table: "ZLOT",
          key: "ZPOSITION",
          type: "INNER",
        },
      ],
      filter: [],
    }
    const positions =
      QuickenDataExtractor.fetchFromQuicken<QuickenPositionData>(
        params,
      )
    const positionsMapped: string[] = []
    positions.forEach((position) => {
      const x = new PositionMapped(position)
      positionsMapped.push(JSON.stringify(x))
    })
    return positionsMapped
  }

  static getLots = () => {
    const params: QuickenSqlBuilderParams = {
      primaryTable: "ZLOT",
      joiningOption: [
        {
          primaryKey: "ZPOSITION",
          table: "ZPOSITION",
          key: "Z_PK",
          type: "INNER",
        },
      ],
      filter: [],
    }
    const lots =
      QuickenDataExtractor.fetchFromQuicken<QuickenLotData>(params)
    const lotsMapped: string[] = []
    lots.forEach((lot) => {
      const x = new LotMapped(lot)
      lotsMapped.push(JSON.stringify(x))
    })
    return lotsMapped
  }
}
