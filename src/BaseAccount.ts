export interface Account {
  name: string
  number?: string
  institution?: string
  notes?: string
  readonly dateCreated: Date
  lastModified: Date
  dateClosed: Date | null
  setClosed: () => void
  isActive: () => boolean
  updateLastModified: () => void
  getLastModified: () => Date
  toJSON: () => string
}

export default abstract class BaseAccount implements Account {
  _name!: string
  _number!: string
  notes?: string | undefined
  readonly dateCreated: Date
  lastModified: Date
  dateClosed: Date | null

  constructor(name: string) {
    const timeStamp = new Date()
    this.name = name
    this.dateCreated = timeStamp
    this.lastModified = timeStamp
    this.dateClosed = null
  }

  institution?: string | undefined

  public toJSON = () => {
    throw new Error("Not implemented yet")
  }

  get name() {
    return this._name
  }

  set name(newName: string) {
    if (newName.length < 5 || newName.length > 30) {
      throw new Error ("Account name must be between 5 and 30 characters long")
    } else {
      this._name = newName
      this.updateLastModified()
    }
  }

  get number() {
    return this._number
  }
  
  set number(newNumber: string) {
    if (newNumber.length < 5 || newNumber.length > 30) {
      throw new Error ("Account number must be between 5 and 30 characters long")
    } else {
      this._number = newNumber
      this.updateLastModified()
    }
  }

  setClosed = () => {
    this.dateClosed = new Date()
  }

  isActive = () => this.dateClosed === null

  updateLastModified = () => {
    this.lastModified = new Date()
  }

  getLastModified = () => this.lastModified
}