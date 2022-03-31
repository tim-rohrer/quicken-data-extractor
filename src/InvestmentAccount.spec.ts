import InvestingAccount from "./InvestmentAccount"

describe("InvestingAccount", () => {
  it("returns an object", () => {
    expect(new InvestingAccount()).toBeInstanceOf(InvestingAccount)
  })
})