import { Result } from "ts-results/result"
import { SqliteDAO } from "./SqliteDAO"

export interface ReadData<T> {
  readAll(tableName: string): Result<T[], unknown>
}

class Repository<T> implements ReadData<T> {
  dao: SqliteDAO

  constructor(daoInstance: SqliteDAO) {
    this.dao = daoInstance
  }

  readAll(tableName: string): Result<T[], unknown> {
    return this.dao.getAll(tableName)
    // throw new Error("Method not implemented.")
  }
}

export default Repository
