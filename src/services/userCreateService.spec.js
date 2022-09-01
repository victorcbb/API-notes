const UserCreateService = require("./UserCreateService")
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory")
const AppError = require("../utils/AppError")

describe("UserCreateService", () => {
  let userRepositoryInMemory = null
  let userCreateService = null

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    userCreateService = new UserCreateService(userRepositoryInMemory)
  })

  it("user should be created", async () => {
    const user = {
      name: "UserTest",
      email: "usertest@email.com",
      password: "123"
    }

    const userCreated = await userCreateService.execute(user)

    expect(userCreated).toHaveProperty("id")
  })

  it("user not should be created if exists the email in another user",
    async () => {
      const user1 = {
        name: "User Test 1",
        email: "usertest1@email.com",
        password: "123"
      }

      const user2 = {
        name: "User Test 2",
        email: "usertest1@email.com",
        password: "123"
      }

      await userCreateService.execute(user1)
      await expect(userCreateService.execute(user2))
        .rejects.toEqual(new AppError("Este e-mail já está em uso."))
    })
})
