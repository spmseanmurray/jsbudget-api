import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'

export default class PasswordResetEmail extends BaseMailer {
  constructor(private user: User, private token: string) {
    super()
  }

  /**
   * The prepare method is invoked automatically when you run
   * "PasswordResetEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    const domain = Env.get('DOMAIN')
    const path = Route.makeUrl('PasswordResetController.reset', [this.token])
    const url = domain + path

    message.subject('Reset Your Password').from(`noreply@jsbudget.com`).to(this.user.email).html(`
        Please click the following link to reset your password
        <a href="${url}">Password Reset</a>
      `)
  }
}
