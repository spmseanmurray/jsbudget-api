import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
  public async register({ request, auth }: HttpContextContract) {
    const registerSchema = schema.create({
      email: schema.string([rules.email(), rules.trim()]),
      password: schema.string([rules.minLength(8)]),
      firstName: schema.string([rules.trim()]),
      lastName: schema.string([rules.trim()]),
    })

    const payload = await request.validate({ schema: registerSchema })

    const user = await User.create(payload)
    await auth.login(user)
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
      await auth.attempt(email, password)
    } catch {
      response.badRequest({ error: 'Invalid login credentials' })
    }
  }
}
