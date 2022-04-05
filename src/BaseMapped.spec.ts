import { CurrencyCode } from "./@types/CurrencyCode.enum"
import BaseMapped from "./BaseMapped"

type TestType = {
  name: string
}
class TestBaseMapped extends BaseMapped<TestType> {

}

describe("BaseMapped", () => {
  it("Validates a value as a string not null/undefined", () => {
    const test = new TestBaseMapped({
      name: "John",
    })

    expect(test.validatedAsString("Tim")).toBe("Tim")
    expect(test.validatedAsString(null)).toBe("BAD VALUE PROVIDED")
  })
  it("Validates a value as a Date, not null/undefined", () => {
    const test = new TestBaseMapped({
      name: "John",
    })

    expect(test.validatedAsDate(new Date(48384878873826))).toBeInstanceOf(Date)
    expect(test.validatedAsDate(null)).toBeNull()
  })
  it("Accepts a currency and returns enum value from ISO 4217", () => {
    const test = new TestBaseMapped({
      name: "John",
    })

    expect(test.mapCurrency("USD")).toEqual(CurrencyCode.USD)
    expect(test.mapCurrency("MXN")).toEqual(CurrencyCode.MXN)
  })
  it("Handles an undefined/null currency by defaulting to USD", () => {
    const test = new TestBaseMapped({
      name: "John",
    })

    expect(test.mapCurrency("")).toEqual(CurrencyCode.USD)
    expect(test.mapCurrency(null)).toEqual(CurrencyCode.USD)
  })
})