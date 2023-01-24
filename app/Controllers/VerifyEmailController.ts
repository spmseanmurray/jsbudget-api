import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Token from 'App/Models/Token'

export default class VerifyEmailController {
  public async verify({ response, params, auth }: HttpContextContract) {
    const user = await Token.getTokenUser(params.token, 'VERIFY_EMAIL')
    const isMatch = user?.id === auth.user?.id

    // if token is invalid, not bound to a user, or does not match the auth user
    if (!user || !isMatch) {
      return response.badRequest({ error: 'Invalid verify email token' })
    }

    user.isEmailVerified = true
    await user.save()
    await Token.expireTokens(user, 'VERIFY_EMAIL')
  }
}
