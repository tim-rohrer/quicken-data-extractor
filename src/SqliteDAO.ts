import sqlite3, { Database } from "sqlite3"
import { Ok, Err, Result, ErrImpl } from "ts-results"
//  import APIError from "../../common/APIError"
//  import { HttpStatusCode } from "../../common/BaseError"
//  import DbError from "../../common/DbError"
//  import { CreateUserDTO } from "../dtos/CreateUserDTO"
//  import { PutUserDTO } from "../dtos/PutUserDTO"
//  import { PatchUserDTO } from "../dtos/PatchUserDTO"
//  import Logger from "../../common/logger"

/** A base Sqlite3 DAO to  */
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

  public static async readAll(
    table = "*",
  ): Promise<Result<any, Error | string>> {
    try {
      console.log(table)
      const results = await SqliteDAO.db.all(
        "SELECT * FROM zaccount",
        (err, rows) => {
          console.log(rows)
        },
      )
      console.log("What?: ", results)
      return Ok(results)
      // await SqliteDAO.db.run(
      //   `SELECT * FROM ${table}`,
      //   [],
      //   (error: ErrImpl<Error>, results) => {
      //     if (error) return Err("Fail")
      //     return Ok(results)
      //   },
      // )
    } catch (error) {
      return Err("Fail")
    }
  }

  public static async addUser(
    userFields: CreateUserDTO,
  ): Promise<Result<boolean, APIError>> {
    try {
      await SqliteDAO.registrants.insertOne(userFields, {
        writeConcern: { w: "majority" },
      })
      return Ok(true)
    } catch (error) {
      if (String(error).includes("E11000 duplicate key error")) {
        return Err(
          new APIError(
            "DUPLICATE_REGISTRANT",
            HttpStatusCode.BAD_REQUEST,
            true,
            `A registrant using ${userFields.email} already exists.`,
          ),
        )
      }
      return Err(
        new DbError(
          "DAO_ERROR",
          HttpStatusCode.INTERNAL_SERVER,
          false,
          `Unknown error attempting to create database record for ${userFields.email}`,
        ),
      )
    }
  }

  public static async getUserById(
    userId: string,
  ): Promise<Result<CreateUserDTO, APIError>> {
    try {
      Logger.debug(`Searching db for ${userId}`)
      const user = await SqliteDAO.registrants.findOne(
        {
          userId,
        },
        {
          projection: { _id: 0 },
        },
      )
      Logger.debug(`The value returned from the db: ${user}`)
      if (user === null || user === undefined) {
        Logger.debug(
          `SqliteDAO.getUserById ${userId} not found in db.`,
        )
        return Err(
          new APIError(
            "REGISTRANT_NOT_FOUND",
            HttpStatusCode.BAD_REQUEST,
            true,
            `Unable to find registrant with id ${userId}`,
          ),
        )
      }
      return Ok(user)
    } catch (error) {
      Logger.error(error)
      return Err(
        new APIError(
          "DAO_ERROR",
          HttpStatusCode.INTERNAL_SERVER,
          false,
          `Unknown error attempting to retrieve database record for ${userId}`,
        ),
      )
    }
  }

  public static async getUserByEmail(
    email: string,
  ): Promise<Result<CreateUserDTO, APIError>> {
    try {
      const registrant = await SqliteDAO.registrants.findOne(
        {
          email,
        },
        {
          projection: { _id: 0 },
        },
      )
      if (registrant === null || registrant === undefined) {
        return Err(
          new APIError(
            "REGISTRANT_NOT_FOUND",
            HttpStatusCode.BAD_REQUEST,
            true,
            `Unable to find registrant with email ${email}`,
          ),
        )
      }
      return Ok(registrant)
    } catch (error) {
      return Err(
        new APIError(
          "DAO_ERROR",
          HttpStatusCode.INTERNAL_SERVER,
          false,
          `Unknown error attempting to retrieve database record for ${email}`,
        ),
      )
    }
  }

  public static async getUserByAPIToken(
    apiToken: string,
  ): Promise<Result<CreateUserDTO, APIError>> {
    try {
      const registrant = await SqliteDAO.registrants.findOne({
        apiToken,
      })
      if (registrant === null || registrant === undefined) {
        return Err(
          new APIError(
            "REGISTRANT_NOT_FOUND",
            HttpStatusCode.BAD_REQUEST,
            true,
            "API Token not found. User probably not registered",
          ),
        )
      }
      return Ok(registrant)
    } catch (error) {
      return Err(
        new APIError(
          "DAO_ERROR",
          HttpStatusCode.INTERNAL_SERVER,
          false,
          "Unknown error attempting to retrieve database record by API token",
        ),
      )
    }
  }

  public static async getAllUsers(): Promise<
    Result<Array<CreateUserDTO> | null, DbError>
  > {
    try {
      return Ok(await SqliteDAO.registrants.find().toArray())
    } catch (error) {
      return Err(
        new DbError(
          "ERROR_GETTING_REGISTRANTS_FROM_DATABASE",
          HttpStatusCode.INTERNAL_SERVER,
          false,
          "Unknown error attempting to retrieve registrants from database",
        ),
      )
    }
  }

  public static async removeUserById(
    userId: string,
  ): Promise<Result<boolean, APIError>> {
    try {
      Logger.debug(`SqliteDAO.registrants.deleteOne with ${userId}`)
      const removalResult = await SqliteDAO.registrants.deleteOne({
        userId,
      })
      Logger.debug(
        `deleteOne results ${JSON.stringify(removalResult)}`,
      )
      if (removalResult.deletedCount === 1) {
        return Ok(true)
      }
      return Err(
        new APIError(
          "DAO_ERROR",
          HttpStatusCode.INTERNAL_SERVER,
          false,
          `Deletion unsuccessful for User: ${userId}`,
        ),
      )
    } catch (error) {
      let errorMessage = "Unknown error"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      return Err(
        new APIError(
          "UNKNOWN_ERROR_FROM_DATABASE_OPERATIONS",
          HttpStatusCode.INTERNAL_SERVER,
          false,
          `Problem with database operation: ${errorMessage}`,
        ),
      )
    }
  }

  public static async updateUserByEmail(
    email: string,
    userFields: PutUserDTO | PatchUserDTO,
  ): Promise<Result<boolean, APIError>> {
    try {
      await SqliteDAO.registrants.updateOne(
        { email: email },
        { $set: userFields },
        {
          writeConcern: { w: "majority" },
        },
      )
      return Ok(true)
    } catch (error) {
      return Err(
        new DbError(
          "DAO_ERROR",
          HttpStatusCode.INTERNAL_SERVER,
          false,
          `Unknown error attempting to update record for ${userFields.email}`,
        ),
      )
    }
  }
}
