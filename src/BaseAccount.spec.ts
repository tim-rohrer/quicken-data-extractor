import BaseAccount from "./BaseAccount"

class MyBaseAccount extends BaseAccount {
  constructor(name: string) {
    super(name)
  }
}

describe("Account", () => {
  jest.useFakeTimers()
  it("returns a properly named/numbered account object", () => {
    const name = "Test Account"
    
    const baseAccount = new MyBaseAccount(name)

    expect(baseAccount.name).toEqual(name)
    expect(baseAccount).toHaveProperty("dateCreated")
    expect(baseAccount.notes).toBeUndefined()
  })

  it("handles and invalid account name", () => {
    expect(() => new MyBaseAccount("Test")).toThrow()
  })
  it("provide equal creation and modification dates", () => {
    const {dateCreated, lastModified} = new MyBaseAccount("TestName")

    expect(dateCreated).toEqual(lastModified)
  })
  it("should update the account name (and lastModified)", () => {
    const newName = "New Name"
    const baseAccount = new MyBaseAccount("TestName")
    const origLastModified = baseAccount.getLastModified()

    jest.advanceTimersByTime(1)
    baseAccount.name = newName

    expect(baseAccount.name).toEqual(newName)
    expect(baseAccount.getLastModified()).not.toEqual(origLastModified)
  })
  it("should return active status false if account is closed", () => {
    const baseAccount = new MyBaseAccount("TestName")
    baseAccount.setClosed()

    expect(baseAccount.dateClosed).not.toBeNull()
    expect(baseAccount.isActive()).toBe(false)
  })
})