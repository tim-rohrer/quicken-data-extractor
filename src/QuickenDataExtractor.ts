import sqlite3 from 'sqlite3';
import {
  open,
} from 'sqlite';
import pluralize from 'pluralize';

export const tables: TablesDataRequest = {
  ZACCOUNT: {
    tableName: 'ZACCOUNT',
    quickenColumnNames: ['Z_PK', 'ZACTIVE', 'ZSINGLEMUTUALFUND', 'ZSTATUSTRANSACTIONCOUNT',
      'ZFINANCIALINSTITUTION', 'ZCREATIONTIMESTAMP', 'ZMODIFICATIONTIMESTAMP', 'ZCURRENCY',
      'ZGUID', 'ZNAME', 'ZNOTES', 'ZTYPENAME', 'ZCLOSED'],
    migratedColumnNames: ['primaryKey', 'activeAccount', 'singleMutualFund', 'statusTransactionCount',
      'financialInstitution', 'creationTimestamp', 'modificationTimestamp', 'currency',
      'globalUID', 'accountName', 'notes', 'typeName', 'closed'],
    filters: [{
      name: 'ZCLOSED',
      expression: '=',
      values: [0],
    },
    {
      name: 'ZTYPENAME',
      expression: '=',
      values: ['RETIREMENTROTHIRA', 'BROKERAGENORMAL'],
    }],
    newKey: 'accountName',
  },
  ZFINANCIALINSTITUTION: {
    tableName: 'ZFINANCIALINSTITUTION',
    quickenColumnNames: ['Z_PK', 'ZLASTUPDATEDFROMFIDIRTIMESTAMP', 'ZBRANDINGINTULOGINURL', 'ZDIRECTCONNECTCONTACTPHONE', 'ZNAME'],
    migratedColumnNames: ['primaryKey', 'lastUpdatedFromFIDIRTimestamp', 'intuitLoginURL', 'directConnectContactPhone', 'financialInstitutionName'],
    filters: [],
    newKey: 'financialInstitutionName',
  },
  ZSECURITY: {
    tableName: 'ZSECURITY',
    quickenColumnNames: ['Z_PK', 'ZTYPE', 'ZLATESTQUOTEDATE', 'ZMODIFICATIONTIMESTAMP', 'ZMOSTRECENTQUOTEDOWNLOADTIMESTAMP',
      'ZASSETCLASSPERCENTAGEDOMESTICBOND', 'ZASSETCLASSPERCENTAGEINTLBOND', 'ZASSETCLASSPERCENTAGEINTLSTOCK', 'ZASSETCLASSPERCENTAGELARGESTOCK',
      'ZASSETCLASSPERCENTAGEMONEYMRKT', 'ZASSETCLASSPERCENTAGEOTHER', 'ZASSETCLASSPERCENTAGESMALLSTOCK', 'ZASSETCLASS', 'ZGUID',
      'ZISSUETYPE', 'ZNAME', 'ZTICKER'],
    migratedColumnNames: ['primaryKey', 'type', 'latestQuoteDate', 'modificationTimestamp', 'latestQuoteTimestamp',
      'percentageDomesticBond', 'percentageIntlBond', 'percentageIntlStock', 'percentageLargeStock',
      'percentageMoneyMarket', 'percentageOther', 'percentageSmallStock', 'assetClass', 'globalUID',
      'issueType', 'name', 'ticker'],
    filters: [{
      name: 'ZISSUETYPE',
      expression: '!=',
      values: ['IN'],
    }],
    newKey: 'ticker',
  },
  ZLOT: {
    tableName: 'ZLOT',
    quickenColumnNames: ['Z_PK', 'ZDELETIONCOUNT', 'ZPOSITION', 'ZACQUISITIONDATE', 'ZCREATIONTIMESTAMP', 'ZINITIALTRANSACTIONDATE', 'ZLATESTTRANSACTIONDATE', 'ZMODIFICATIONTIMESTAMP', 'ZINITIALCOSTBASIS', 'ZINITIALUNITS', 'ZLATESTCOSTBASIS', 'ZLATESTUNITS', 'ZGUID',
    ],
    migratedColumnNames: ['primaryKey', 'deletionCount', 'position', 'acquisitionDate', 'creationTimestamp', 'initialTransactionDate', 'latestTransactionDate', 'modificationTimestamp', 'initialCostBasis', 'initialUnits', 'latestCostBasis', 'latestUnits', 'globalUID',
    ],
    newKey: 'position',
  },
  ZPOSITION: {
    tableName: 'ZPOSITION',
    quickenColumnNames: ['Z_PK', 'ZCOSTBASISALGORITHM', 'ZDELETIONCOUNT', 'ZQUICKENID', 'ZTYPE', 'ZACCOUNT', 'ZSECURITY', 'ZCREATIONTIMESTAMP', 'ZMODIFICATIONTIMESTAMP', 'ZGUID', 'ZUNIQUEID', 'ZUNIQUEIDTYPE'],
    migratedColumnNames: ['primaryKey', 'costBasisAlgorithm', 'deletionCount', 'quickenID', 'type', 'account', 'security', 'creationTimestamp', 'modificationTimestamp', 'globalUID', 'uniqueID', 'uniqueIDType'],
    filters: [{
      name: 'ZSECURITY',
      expression: 'NOT',
      values: [null],
    }],
    newKey: 'security',
  },
};

export interface Row {
  col: string
}

export type QuickenTableName = 'ZACCOUNT' |
  'ZFINANCIALINSTITUTION' |
  'ZPOSITION' |
  'ZSECURITY' |
  'ZSECURITYQUOTE' |
  'ZSECURITYQUOTEDETAIL' |
  'ZLOT' |
  'ZLOTMOD' |
  'ZLOTASSIGNMENT' |
  'ZPOSITION' |
  'ZFIPOSITION' |
  'ZFITRANSACTION' |
  'ZTRANSACTION';

export type RowFilter = {
  name: string;
  expression: string;
  values: Array < string | number | null > ;
}

export interface TableColsMap {
  tableName: QuickenTableName,
    quickenColumnNames: Array < string >,
    migratedColumnNames: Array < string >,
    filters ? : Array < RowFilter >,
    newKey: string,
}

export type TablesDataRequest = {
  [x: string]: TableColsMap;
}

export interface ExtractorResponse {
  [table: string]: {
    [key: string]: Record<any, any>,
    // [z: string]: Array<string>,
  }
}

export class QuickenDataExtractor {
  dbPathName: string;
  tablesInfo: any;

  constructor(dbPathName: string) {
    this.dbPathName = dbPathName;
    this.tablesInfo = tables;
  }

  public openDatabase = async () => {
    try {
      return await open({
        filename: this.dbPathName,
        driver: sqlite3.Database,
      });
    } catch (err) {
      throw new Error('Error opening database');
    }
  };

  private prepareWhereElement = (
    name: string,
    expression: string,
    values: Array < string | number | null >,
  ) => {
    let elementString: string = '';
    values.forEach((value) => {
      if (elementString !== '') {
        elementString += ' OR ';
      }
      if (typeof value === 'string') {
        elementString += `${name} ${expression} '${value}'`;
      } else elementString += `${name} ${expression} ${value}`;
    });
    return elementString;
  }

  private prepareWhereString = (filters: Array < RowFilter >) => {
    let whereString: string = '';
    filters.forEach(({
      name,
      expression,
      values,
    }) => {
      if (whereString !== '') {
        whereString += ' AND ';
      }
      whereString += ` (${this.prepareWhereElement(name, expression, values)}) `;
    });
    return whereString;
  }

  private fetchTableData = async (
    colsString: string,
    tableName: QuickenTableName,
    whereString: string,
  ) => {
    try {
      const myDB = await this.openDatabase();
      const tableResult = await myDB.all < Row[] >(`SELECT ${colsString} FROM ${tableName} ${whereString}`);
      await myDB.close();
      return tableResult;
    } catch (err) {
      throw new Error('Unable to fetch table data');
    }
  }

  private fetchRequestedData = async (request: TablesDataRequest) => {
    let results = {};
    await Promise.all(Object.values(request)
      .map(async ({
        tableName,
        quickenColumnNames,
        filters,
      }) => {
        const colsString = (quickenColumnNames[0] === 'ALL') ? '*' : quickenColumnNames.toString();
        let filtersString: string = '';
        if (filters !== undefined && filters.length > 0) {
          filtersString = `WHERE ${this.prepareWhereString(filters)}`;
        }
        const tableResults = await this.fetchTableData(colsString, tableName, filtersString);
        results = {
          ...results,
          [tableName]: tableResults,
        };
      }));
    return results;
  }

  private migrateColumnNamesForTable = (tableName: QuickenTableName, row: Record < any, any >) => {
    const newEntry: {
      [x: string]: any
    } = {};
    const actualColumnNames = Object.keys(row);
    actualColumnNames.forEach((columnName, index) => {
      const newColumnName: string = this.tablesInfo[tableName].migratedColumnNames[index];
      newEntry[newColumnName] = row[columnName];
    });
    return newEntry;
  }

  public tddMigrateColumnNamesForTable = (
    tableName: QuickenTableName,
    row: Record<any, any>,
  ) => this.migrateColumnNamesForTable(tableName, row);

  private migrateAndNormalizeTable = (tableName: QuickenTableName, tableData: Record<any, any>) => {
    const newTable: {
      [key: string]: Record<any, any>
    } = {};
    tableData.forEach((row: Record<any, any>) => {
      const migratedRow = this.migrateColumnNamesForTable(tableName, row);
      newTable[migratedRow[this.tablesInfo[tableName].newKey]] = migratedRow;
    });
    const keyBase = this.tablesInfo[tableName].newKey;
    const capitalStr = keyBase.charAt(0).toUpperCase() + keyBase.slice(1);
    const byKey = `by${capitalStr}`;
    const allKeys = pluralize(`all${capitalStr}`);
    const normalizedTable = {
      [byKey]: newTable,
      [allKeys]: Object.keys(newTable),
    };
    return normalizedTable;
  };

  private migrateData = (quickenData: Record<any, any>) => {
    const migratedTables: ExtractorResponse = {};
    // console.log('Quicken data prior to column name migration: ', quickenData);
    const tableNames = Object.keys(quickenData) as Array < QuickenTableName >;
    tableNames.forEach((tableName) => {
      migratedTables[tableName] = this.migrateAndNormalizeTable(tableName, quickenData[tableName]);
      // console.log('Migrated Table: ', migratedTables);
    });
    return migratedTables;
  }

  fetchAndMigrateQuickenData = async () => {
    const quickenData = await this.fetchRequestedData(this.tablesInfo);
    // console.log(quickenData);
    return this.migrateData(quickenData);
  }
}
