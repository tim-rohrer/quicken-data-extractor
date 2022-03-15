import { Database, SqliteError } from "better-sqlite3"
import { Ok, Err, Result } from "ts-results"
//  import APIError from "../../common/APIError"
//  import { HttpStatusCode } from "../../common/BaseError"
//  import DbError from "../../common/DbError"
//  import { CreateUserDTO } from "../dtos/CreateUserDTO"
//  import { PutUserDTO } from "../dtos/PutUserDTO"
//  import { PatchUserDTO } from "../dtos/PatchUserDTO"
//  import Logger from "../../common/logger"

function escapeSQL(value: string) {
  // eslint-disable-next-line quotes
  return '"' + String(value).replace(/"/g, '""') + '"'
}
export class SqliteDAO {
  private static instance: SqliteDAO = new SqliteDAO()
  private static db: Database
  private static table: Record<string, unknown>

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

  // public static get(sql: string, params): Promise<unknown> {
  //   return new Error("Not implemented yet")
  // }

  public static getAll(
    table: string,
  ): Result<Array<Record<any, any>>, typeof SqliteError> {
    const tableData = SqliteDAO.db
      .prepare(`SELECT * FROM ${escapeSQL(table)}`)
      .all()
    return Ok(tableData)
  }
}
