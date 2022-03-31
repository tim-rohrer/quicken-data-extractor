import { CurrencyCode } from "./@types/CurrencyCode.enum";

interface BaseDataFromQuicken<T> {
  quickenData: T
}

abstract class BaseMapped<T> implements BaseDataFromQuicken<T> {
  quickenData: T;

  constructor (quickenData: T) {
    this.quickenData = quickenData
  }

  // abstract mapQuickenData(): BaseMapped<T>

  validatedAsString = (someString: string | undefined | null) => {
    if (someString !== null && someString !== undefined) {
      return someString
    } else {
      return "BAD VALUE PROVIDED"
    }
  }

  validatedAsDate = (date: Date | null | undefined) => {
    if (date !== null && date !== undefined) {
      return date
    }
    return null
  }

  mapCurrency = (qCurrency: string): CurrencyCode => {
    type StringEnum = {[key: string]: string};
    function lookup<E extends StringEnum>(stringEnum: E, s: string): keyof E {
      for (const enumValue of keysOf(stringEnum)) {
        if (stringEnum[enumValue] === s) {
          return enumValue;
        }
      }
      return CurrencyCode.USD;
    }
    function keysOf<K extends {}>(o: K): (keyof K)[]
    function keysOf(o: any) { return Object.keys(o) }

    const currency = lookup(CurrencyCode, qCurrency)
    return CurrencyCode[currency]
  }
}

export default BaseMapped