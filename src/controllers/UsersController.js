const { hash, compare } = require("bcryptjs")

const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")

const UserRepository = require("../repositories/UserRepository")
const UserCreateService = require("../services/UserCreateService")

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body

    const userRepository = new UserRepository()
    const userCreateService = new UserCreateService(userRepository)
    
    await userCreateService.execute({ name, email, password })

    return res.status(201).json()
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body
    const user_id = req.user.id

    const database = await sqliteConnection()
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])

    if (!user) {
      throw new AppError("Usuário não encontrado")
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)", [email]
    )

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este email já está sendo utilizado")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError(
        "Por favor, informar senha antiga para definar a nova senha."
      )
    }

    if (!password && old_password) {
      throw new AppError(
        "Por favor, informar senha nova senha para ser definida."
      )
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError("Senha antiga não confere")
      }

      user.password = await hash(password, 8)
    }

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    )

    return res.json()
  }
}

module.exports = UsersController
