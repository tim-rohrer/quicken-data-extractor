import { Database, SqliteError } from "better-sqlite3"
import { Ok, Err, Result } from "ts-results"
import { ZACCOUNTEntity } from "./@types/Database"
//  import APIError from "../../common/APIError"
//  import { HttpStatusCode } from "../../common/BaseError"
//  import DbError from "../../common/DbError"
//  import { CreateUserDTO } from "../dtos/CreateUserDTO"
//  import { PutUserDTO } from "../dtos/PutUserDTO"
//  import { PatchUserDTO } from "../dtos/PatchUserDTO"
//  import Logger from "../../common/logger"

export interface SqliteDAOGetParams {
  stmt: string,
  parameterVals: Record<string, string | number>
}

export class SqliteDAO {
  private static instance: SqliteDAO = new SqliteDAO()
  private static db: Database

  private constructor() {
    if (SqliteDAO.instance) {
      throw new Error(
        "Error: Instantiation failed: Use SqliteDAO.injectDB(conn) instead of new.",
      )
    }
    SqliteDAO.instance = this
  }

  public static async injectDB(conn: Database): Promise<void> {
    SqliteDAO.db = conn
  }

  private static escapeSQL(value: string) {
    // eslint-disable-next-line quotes
    return '"' + String(value).replace(/"/g, '""') + '"'
  }

  public static getByStatementAndParameters<T>(
    params: SqliteDAOGetParams
  ): Result<T[], typeof SqliteError> {
    const tableData = SqliteDAO.db
      .prepare(params.stmt)
      .expand()
      .all(params.parameterVals)
    return Ok(tableData as T[])
  }

  public static getAllFromTable(
    table: string,
  ): Result<unknown[], typeof SqliteError> {
    const tableData = SqliteDAO.db
      .prepare(`SELECT * FROM ${SqliteDAO.escapeSQL(table)}`)
      .all()
    return Ok(tableData)
  }
}
