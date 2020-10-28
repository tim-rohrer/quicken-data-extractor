"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickenDataExtractor = exports.tables = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const pluralize_1 = __importDefault(require("pluralize"));
exports.tables = {
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
                values: ["RETIREMENTROTHIRA", "BROKERAGENORMAL"],
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
};
class QuickenDataExtractor {
    constructor(dbPathName) {
        this.openDatabase = async () => {
            try {
                return await sqlite_1.open({
                    filename: this.dbPathName,
                    driver: sqlite3_1.default.Database,
                });
            }
            catch (err) {
                throw new Error("Error opening database");
            }
        };
        this.prepareWhereElement = (name, expression, values) => {
            let elementString = "";
            values.forEach((value) => {
                if (elementString !== "") {
                    elementString += " OR ";
                }
                if (typeof value === "string") {
                    elementString += `${name} ${expression} '${value}'`;
                }
                else
                    elementString += `${name} ${expression} ${value}`;
            });
            return elementString;
        };
        this.prepareWhereString = (filters) => {
            let whereString = "";
            filters.forEach(({ name, expression, values }) => {
                if (whereString !== "") {
                    whereString += " AND ";
                }
                whereString += ` (${this.prepareWhereElement(name, expression, values)}) `;
            });
            return whereString;
        };
        this.fetchTableData = async (colsString, tableName, whereString) => {
            try {
                const myDB = await this.openDatabase();
                const tableResult = await myDB.all(`SELECT ${colsString} FROM ${tableName} ${whereString}`);
                await myDB.close();
                return tableResult;
            }
            catch (err) {
                throw new Error("Unable to fetch table data");
            }
        };
        this.fetchRequestedData = async (request) => {
            let results = {};
            await Promise.all(Object.values(request).map(async ({ tableName, quickenColumnNames, filters }) => {
                const colsString = quickenColumnNames[0] === "ALL"
                    ? "*"
                    : quickenColumnNames.toString();
                let filtersString = "";
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
        };
        this.migrateColumnNamesForTable = (tableName, row) => {
            const newEntry = {};
            const actualColumnNames = Object.keys(row);
            actualColumnNames.forEach((columnName, index) => {
                const newColumnName = this.tablesInfo[tableName]
                    .migratedColumnNames[index];
                newEntry[newColumnName] = row[columnName];
            });
            return newEntry;
        };
        this.tddMigrateColumnNamesForTable = (tableName, row) => this.migrateColumnNamesForTable(tableName, row);
        this.migrateAndNormalizeTable = (tableName, tableData) => {
            const newTable = {};
            tableData.forEach((row) => {
                const migratedRow = this.migrateColumnNamesForTable(tableName, row);
                newTable[migratedRow[this.tablesInfo[tableName].newKey]] = migratedRow;
            });
            const keyBase = this.tablesInfo[tableName].newKey;
            const capitalStr = keyBase.charAt(0).toUpperCase() + keyBase.slice(1);
            const byKey = `by${capitalStr}`;
            const allKeys = pluralize_1.default(`all${capitalStr}`);
            const normalizedTable = {
                [byKey]: newTable,
                [allKeys]: Object.keys(newTable),
            };
            return normalizedTable;
        };
        this.migrateData = (quickenData) => {
            const migratedTables = {};
            // console.log('Quicken data prior to column name migration: ', quickenData);
            const tableNames = Object.keys(quickenData);
            tableNames.forEach((tableName) => {
                migratedTables[tableName] = this.migrateAndNormalizeTable(tableName, quickenData[tableName]);
                // console.log('Migrated Table: ', migratedTables);
            });
            return migratedTables;
        };
        this.fetchAndMigrateQuickenData = async () => {
            const quickenData = await this.fetchRequestedData(this.tablesInfo);
            // console.log(quickenData);
            return this.migrateData(quickenData);
        };
        this.dbPathName = dbPathName;
        this.tablesInfo = exports.tables;
    }
}
exports.QuickenDataExtractor = QuickenDataExtractor;
