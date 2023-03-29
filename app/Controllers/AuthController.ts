import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { CreateUserValidator } from 'App/Validators/UserValidator'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import Token from 'App/Models/Token'

export default class AuthController {
  public async index({ response, auth }: HttpContextContract) {
    if (auth.isGuest) return response.unauthorized()

    return response.json(auth.user)
  }

  public async register({ response, request, auth }: HttpContextContract) {
    const payload = await request.validate(CreateUserValidator)

    const user = await User.create(payload)
    await auth.login(user)

    const token = await Token.generateVerifyEmailToken(user)
    await new VerifyEmail(user, token).sendLater()

    return response.json(auth.user)
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
      await auth.attempt(email, password)
      return response.json(auth.user)
    } catch {
      return response.badRequest({ error: 'Invalid login credentials' })
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.logout()
  }
}
