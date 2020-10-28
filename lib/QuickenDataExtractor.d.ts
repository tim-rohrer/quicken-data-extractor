/// <reference types="./vendor-typings/sqlite3" />
import sqlite3 from "sqlite3";
export declare const tables: TablesDataRequest;
export interface Row {
    col: string;
}
export declare type QuickenTableName = "ZACCOUNT" | "ZFINANCIALINSTITUTION" | "ZPOSITION" | "ZSECURITY" | "ZSECURITYQUOTE" | "ZSECURITYQUOTEDETAIL" | "ZLOT" | "ZLOTMOD" | "ZLOTASSIGNMENT" | "ZPOSITION" | "ZFIPOSITION" | "ZFITRANSACTION" | "ZTRANSACTION";
export declare type RowFilter = {
    name: string;
    expression: string;
    values: Array<string | number | null>;
};
export interface TableColsMap {
    tableName: QuickenTableName;
    quickenColumnNames: Array<string>;
    migratedColumnNames: Array<string>;
    filters?: Array<RowFilter>;
    newKey: string;
}
export declare type TablesDataRequest = {
    [x: string]: TableColsMap;
};
export interface ExtractorResponse {
    [table: string]: {
        [key: string]: Record<string, any>;
    };
}
export declare class QuickenDataExtractor {
    dbPathName: string;
    tablesInfo: TablesDataRequest;
    constructor(dbPathName: string);
    openDatabase: () => Promise<import("sqlite").Database<sqlite3.Database, sqlite3.Statement>>;
    private prepareWhereElement;
    private prepareWhereString;
    private fetchTableData;
    private fetchRequestedData;
    private migrateColumnNamesForTable;
    tddMigrateColumnNamesForTable: (tableName: QuickenTableName, row: Record<any, any>) => {
        [x: string]: string | number;
    };
    private migrateAndNormalizeTable;
    private migrateData;
    fetchAndMigrateQuickenData: () => Promise<ExtractorResponse>;
}
