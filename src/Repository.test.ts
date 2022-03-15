import { OkImpl } from "ts-results"
import Repository from "./Repository"
import { SqliteDAO } from "./SqliteDAO"

let repository: Repository<string>
const mockDAO = jest.fn()

describe("Repository", () => {
  beforeAll(() => {
    repository = new Repository(mockDAO)
  })
  it("Does something", async () => {
    const spy = jest.spyOn(SqliteDAO, "getAll").mockReturnValue(<
      OkImpl<unknown>
    >{
      ok: true,
      err: false,
      val: true,
    })

    const result = repository.readAll("")
    console.log(result)
    expect(await repository.readAll("test_table")).toBeTruthy()
  })
})
