import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Token from 'App/Models/Token'
import PasswordResetEmail from 'App/Mailers/PasswordResetEmail'
import { ResetUserPasswordValidator } from 'App/Validators/UserValidator'

export default class PasswordResetController {
  public async send({ request }: HttpContextContract) {
    const emailSchema = schema.create({
      email: schema.string([rules.email()]),
    })

    const { email } = await request.validate({ schema: emailSchema })
    const user = await User.findByOrFail('email', email)
    const token = await Token.generatePasswordResetToken(user)

    await new PasswordResetEmail(user, token).sendLater()
  }

  public async verify({ request, response }: HttpContextContract) {
    const { token } = request.params()

    const isValid = await Token.verify(token, 'PASSWORD_RESET')

    if (!isValid) {
      return response.badRequest({ error: 'Invalid password reset token' })
    }
  }

  public async reset({ request, response, auth }: HttpContextContract) {
    const { token, email, password } = await request.validate(ResetUserPasswordValidator)
    const user = await Token.getTokenUser(token, 'PASSWORD_RESET')

    const isMatch = user?.email === email

    // if token is invalid, not bound to a user, or does not match the requested user
    if (!user || !isMatch) {
      return response.badRequest({ error: 'Invalid password reset token' })
    }

    await user.merge({ password }).save()
    await auth.login(user)
    await Token.expireTokens(user, 'PASSWORD_RESET')
  }
}
