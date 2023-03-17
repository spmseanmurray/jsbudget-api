import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Token from 'App/Models/Token'

export default class VerifyEmailController {
  public async verify({ response, params }: HttpContextContract) {
    const user = await Token.getTokenUser(params.token, 'VERIFY_EMAIL')

    // if token is invalid, not bound to a user
    if (!user) {
      return response.badRequest({ error: 'Invalid verify email token' })
    }

    user.isEmailVerified = true
    await user.save()
    await Token.expireTokens(user, 'VERIFY_EMAIL')
  }
}
