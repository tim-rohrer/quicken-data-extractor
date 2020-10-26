"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.tables = void 0;

var _sqlite = _interopRequireDefault(require("sqlite3"));

var _sqlite2 = require("sqlite");

var _pluralize = _interopRequireDefault(require("pluralize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const tables = {
  ZACCOUNT: {
    tableName: 'ZACCOUNT',
    quickenColumnNames: ['Z_PK', 'ZACTIVE', 'ZSINGLEMUTUALFUND', 'ZSTATUSTRANSACTIONCOUNT', 'ZFINANCIALINSTITUTION', 'ZCREATIONTIMESTAMP', 'ZMODIFICATIONTIMESTAMP', 'ZCURRENCY', 'ZGUID', 'ZNAME', 'ZNOTES', 'ZTYPENAME', 'ZCLOSED'],
    migratedColumnNames: ['primaryKey', 'activeAccount', 'singleMutualFund', 'statusTransactionCount', 'financialInstitution', 'creationTimestamp', 'modificationTimestamp', 'currency', 'globalUID', 'accountName', 'notes', 'typeName', 'closed'],
    filters: [{
      name: 'ZCLOSED',
      expression: '=',
      values: [0]
    }, {
      name: 'ZTYPENAME',
      expression: '=',
      values: ['RETIREMENTROTHIRA', 'BROKERAGENORMAL']
    }],
    newKey: 'accountName'
  },
  ZFINANCIALINSTITUTION: {
    tableName: 'ZFINANCIALINSTITUTION',
    quickenColumnNames: ['Z_PK', 'ZLASTUPDATEDFROMFIDIRTIMESTAMP', 'ZBRANDINGINTULOGINURL', 'ZDIRECTCONNECTCONTACTPHONE', 'ZNAME'],
    migratedColumnNames: ['primaryKey', 'lastUpdatedFromFIDIRTimestamp', 'intuitLoginURL', 'directConnectContactPhone', 'financialInstitutionName'],
    filters: [],
    newKey: 'financialInstitutionName'
  },
  ZSECURITY: {
    tableName: 'ZSECURITY',
    quickenColumnNames: ['Z_PK', 'ZTYPE', 'ZLATESTQUOTEDATE', 'ZMODIFICATIONTIMESTAMP', 'ZMOSTRECENTQUOTEDOWNLOADTIMESTAMP', 'ZASSETCLASSPERCENTAGEDOMESTICBOND', 'ZASSETCLASSPERCENTAGEINTLBOND', 'ZASSETCLASSPERCENTAGEINTLSTOCK', 'ZASSETCLASSPERCENTAGELARGESTOCK', 'ZASSETCLASSPERCENTAGEMONEYMRKT', 'ZASSETCLASSPERCENTAGEOTHER', 'ZASSETCLASSPERCENTAGESMALLSTOCK', 'ZASSETCLASS', 'ZGUID', 'ZISSUETYPE', 'ZNAME', 'ZTICKER'],
    migratedColumnNames: ['primaryKey', 'type', 'latestQuoteDate', 'modificationTimestamp', 'latestQuoteTimestamp', 'percentageDomesticBond', 'percentageIntlBond', 'percentageIntlStock', 'percentageLargeStock', 'percentageMoneyMarket', 'percentageOther', 'percentageSmallStock', 'assetClass', 'globalUID', 'issueType', 'name', 'ticker'],
    filters: [{
      name: 'ZISSUETYPE',
      expression: '!=',
      values: ['IN']
    }],
    newKey: 'ticker'
  },
  ZLOT: {
    tableName: 'ZLOT',
    quickenColumnNames: ['Z_PK', 'ZDELETIONCOUNT', 'ZPOSITION', 'ZACQUISITIONDATE', 'ZCREATIONTIMESTAMP', 'ZINITIALTRANSACTIONDATE', 'ZLATESTTRANSACTIONDATE', 'ZMODIFICATIONTIMESTAMP', 'ZINITIALCOSTBASIS', 'ZINITIALUNITS', 'ZLATESTCOSTBASIS', 'ZLATESTUNITS', 'ZGUID'],
    migratedColumnNames: ['primaryKey', 'deletionCount', 'position', 'acquisitionDate', 'creationTimestamp', 'initialTransactionDate', 'latestTransactionDate', 'modificationTimestamp', 'initialCostBasis', 'initialUnits', 'latestCostBasis', 'latestUnits', 'globalUID'],
    newKey: 'position'
  },
  ZPOSITION: {
    tableName: 'ZPOSITION',
    quickenColumnNames: ['Z_PK', 'ZCOSTBASISALGORITHM', 'ZDELETIONCOUNT', 'ZQUICKENID', 'ZTYPE', 'ZACCOUNT', 'ZSECURITY', 'ZCREATIONTIMESTAMP', 'ZMODIFICATIONTIMESTAMP', 'ZGUID', 'ZUNIQUEID', 'ZUNIQUEIDTYPE'],
    migratedColumnNames: ['primaryKey', 'costBasisAlgorithm', 'deletionCount', 'quickenID', 'type', 'account', 'security', 'creationTimestamp', 'modificationTimestamp', 'globalUID', 'uniqueID', 'uniqueIDType'],
    filters: [{
      name: 'ZSECURITY',
      expression: 'NOT',
      values: [null]
    }],
    newKey: 'security'
  }
};
exports.tables = tables;

class QuickenDataExtractor {
  constructor(dbPathName) {
    _defineProperty(this, "dbPathName", void 0);

    _defineProperty(this, "tablesInfo", void 0);

    _defineProperty(this, "openDatabase", async () => {
      try {
        return await (0, _sqlite2.open)({
          filename: this.dbPathName,
          driver: _sqlite.default.Database
        });
      } catch (err) {
        throw new Error('Error opening database');
      }
    });

    _defineProperty(this, "prepareWhereElement", (name, expression, values) => {
      let elementString = '';
      values.forEach(value => {
        if (elementString !== '') {
          elementString += ' OR ';
        }

        if (typeof value === 'string') {
          elementString += `${name} ${expression} '${value}'`;
        } else elementString += `${name} ${expression} ${value}`;
      });
      return elementString;
    });

    _defineProperty(this, "prepareWhereString", filters => {
      let whereString = '';
      filters.forEach(({
        name,
        expression,
        values
      }) => {
        if (whereString !== '') {
          whereString += ' AND ';
        }

        whereString += ` (${this.prepareWhereElement(name, expression, values)}) `;
      });
      return whereString;
    });

    _defineProperty(this, "fetchTableData", async (colsString, tableName, whereString) => {
      try {
        const myDB = await this.openDatabase();
        const tableResult = await myDB.all(`SELECT ${colsString} FROM ${tableName} ${whereString}`);
        await myDB.close();
        return tableResult;
      } catch (err) {
        throw new Error('Unable to fetch table data');
      }
    });

    _defineProperty(this, "fetchRequestedData", async request => {
      let results = {};
      await Promise.all(Object.values(request).map(async ({
        tableName,
        quickenColumnNames,
        filters
      }) => {
        const colsString = quickenColumnNames[0] === 'ALL' ? '*' : quickenColumnNames.toString();
        let filtersString = '';

        if (filters !== undefined && filters.length > 0) {
          filtersString = `WHERE ${this.prepareWhereString(filters)}`;
        }

        const tableResults = await this.fetchTableData(colsString, tableName, filtersString);
        results = _objectSpread(_objectSpread({}, results), {}, {
          [tableName]: tableResults
        });
      }));
      return results;
    });

    _defineProperty(this, "migrateColumnNamesForTable", (tableName, row) => {
      const newEntry = {};
      const actualColumnNames = Object.keys(row);
      actualColumnNames.forEach((columnName, index) => {
        const newColumnName = this.tablesInfo[tableName].migratedColumnNames[index];
        newEntry[newColumnName] = row[columnName];
      });
      return newEntry;
    });

    _defineProperty(this, "tddMigrateColumnNamesForTable", (tableName, row) => this.migrateColumnNamesForTable(tableName, row));

    _defineProperty(this, "migrateAndNormalizeTable", (tableName, tableData) => {
      const newTable = {};
      tableData.forEach(row => {
        const migratedRow = this.migrateColumnNamesForTable(tableName, row);
        newTable[migratedRow[this.tablesInfo[tableName].newKey]] = migratedRow;
      });
      const keyBase = this.tablesInfo[tableName].newKey;
      const capitalStr = keyBase.charAt(0).toUpperCase() + keyBase.slice(1);
      const byKey = `by${capitalStr}`;
      const allKeys = (0, _pluralize.default)(`all${capitalStr}`);
      const normalizedTable = {
        [byKey]: newTable,
        [allKeys]: Object.keys(newTable)
      };
      return normalizedTable;
    });

    _defineProperty(this, "migrateData", quickenData => {
      const migratedTables = {}; // console.log('Quicken data prior to column name migration: ', quickenData);

      const tableNames = Object.keys(quickenData);
      tableNames.forEach(tableName => {
        migratedTables[tableName] = this.migrateAndNormalizeTable(tableName, quickenData[tableName]); // console.log('Migrated Table: ', migratedTables);
      });
      return migratedTables;
    });

    _defineProperty(this, "fetchAndMigrateQuickenData", async () => {
      const quickenData = await this.fetchRequestedData(this.tablesInfo); // console.log(quickenData);

      return this.migrateData(quickenData);
    });

    this.dbPathName = dbPathName;
    this.tablesInfo = tables;
  }

}

exports.default = QuickenDataExtractor;