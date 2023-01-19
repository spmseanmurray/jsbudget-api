import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UpdateUserValidator } from 'App/Validators/UserValidator'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const users = await User.all()

    response.json(users)
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params()
    try {
      const user = await User.findOrFail(id)
      response.json(user)
    } catch {
      response.unprocessableEntity({
        error: 'request could not be completed due to semantic errors',
      })
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const payload = await request.validate(UpdateUserValidator)
    const { id } = request.params()

    const user = await User.findOrFail(id)
    await user.merge(payload).save()

    response.json(user)
  }

  public async destroy({ request }: HttpContextContract) {
    const { id } = request.params()

    const user = await User.findOrFail(id)
    await user.delete()
  }
}
