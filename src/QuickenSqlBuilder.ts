type Operator =
  | "="
  | "<"
  | ">"
  | ">="
  | "<="
  | "<>"
  | "LIKE"
  | "IN"
  | "BETWEEN"

type SqlFilter = {
  columnName: string
  expression: Operator
  values: string[] | number[]
}

type JoiningOption = {
  primaryKey: string
  table: string
  key: string
  type: "LEFT" | "INNER" | "RIGHT"
}

export interface QuickenSqlBuilderParams {
  primaryTable: string
  joiningOption: JoiningOption[]
  filter: SqlFilter[] | null
}

export default class QuickenSqlBuilder {
  primaryTable
  joiningOption: JoiningOption[]
  filter
  index
  vals: Record<string, string | number>

  constructor(params: QuickenSqlBuilderParams) {
    this.primaryTable = QuickenSqlBuilder.escapeSQL(
      params.primaryTable,
    )
    this.joiningOption = params.joiningOption
    // this.primaryKey = QuickenSqlBuilder.escapeSQL(params.primaryKey)
    // this.joiningTable = QuickenSqlBuilder.escapeSQL(
    //   params.joiningTable,
    // )
    // this.joiningKey = QuickenSqlBuilder.escapeSQL(params.joiningKey)
    // this.joiningType = params.joiningType
    this.filter = params.filter
    this.index = 0
    this.vals = {}
  }

  private static escapeSQL(value: string) {
    // eslint-disable-next-line quotes
    return '"' + String(value).replace(/"/g, '""') + '"'
  }

  private prepareWhereClauseElements(values: string[] | number[]) {
    const searchVals: Record<string, string | number> = {}
    let searchNamedParams = "("
    values.forEach((val) => {
      const valKey = "val" + this.index
      this.index++
      searchNamedParams += `@${valKey}`
      if (this.index < values.length) searchNamedParams += ", "
      searchVals[valKey] = val
    })
    searchNamedParams += ")"
    return {
      tempSearchNamedParams: searchNamedParams,
      tempSearchVals: searchVals,
    }
  }

  private prepareWhereClause = (
    filters: Array<SqlFilter>,
    escTableName: string,
  ): any => {
    let whereString = ""
    let searchVals: Record<string, string | number> = {}
    filters.forEach(({ columnName, expression, values }) => {
      if (values.length > 1) {
        expression = "IN"
      }
      const { tempSearchNamedParams, tempSearchVals } =
        this.prepareWhereClauseElements(values)
      const escColumnName = QuickenSqlBuilder.escapeSQL(columnName)
      if (whereString.length > 0) {
        whereString += ` AND ${escTableName}.${escColumnName} ${expression} ${tempSearchNamedParams}`
      } else {
        whereString = ` WHERE ${escTableName}.${escColumnName} ${expression} ${tempSearchNamedParams}`
      }
      searchVals = {
        ...searchVals,
        ...tempSearchVals,
      }
    })
    return {
      whereClause: whereString,
      searchVals,
    }
  }

  private prepareJoiningSegment(
    primaryTable: string,
    joiningOption: JoiningOption[],
  ) {
    let joiningSegment = ""
    joiningOption.forEach((joiningElement) => {
      const type = joiningElement.type
      const table = QuickenSqlBuilder.escapeSQL(joiningElement.table)
      const primaryKey = QuickenSqlBuilder.escapeSQL(
        joiningElement.primaryKey,
      )
      const key = QuickenSqlBuilder.escapeSQL(joiningElement.key)
      joiningSegment += ` ${type} JOIN ${table} ON ${primaryTable}.${primaryKey} = ${table}.${key}`
    })
    return joiningSegment
  }

  public stmt() {
    this.index = 0
    let stmt = `SELECT * FROM ${this.primaryTable}`
    if (this.joiningOption.length > 0)
      stmt += this.prepareJoiningSegment(
        this.primaryTable,
        this.joiningOption,
      )
    // if (this.joiningTable !== '""' && this.joiningKey !== '""') {
    //   stmt += ` ${this.joiningType} JOIN ${this.joiningTable} ON ${this.primaryTable}.${this.primaryKey} = ${this.joiningTable}.${this.joiningKey}`
    // }
    if (this.filter !== null) {
      const { whereClause, searchVals } = this.prepareWhereClause(
        this.filter,
        this.primaryTable,
      )
      this.vals = searchVals
      stmt += whereClause
    }
    return stmt
  }

  public parameterVals() {
    return this.vals
  }
}
