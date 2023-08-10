import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateCategoryValidator, UpdateCategoryValidator } from 'App/Validators/CategoryValidator'

export default class CategoriesController {
  public async index({ response, auth }: HttpContextContract) {
    if (!auth.user) return response.unauthorized()

    const categories = await auth.user.related('catagories').query()

    return response.json(categories)
  }

  public async show({ request, response, auth }: HttpContextContract) {
    const { id } = request.params()

    if (!auth.user) return response.unauthorized()

    try {
      const category = await auth.user.related('catagories').query().where('id', id).firstOrFail()

      return response.json(category)
    } catch {
      return response.unprocessableEntity({
        error: 'request could not be completed due to semantic errors',
      })
    }
  }

  public async create({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return response.unauthorized()

    const { category, subcategories, color, type } = await request.validate(CreateCategoryValidator)

    try {
      const createdCategory = await auth.user
        .related('catagories')
        .create({ category, subcategories, color, type })

      return response.json(createdCategory)
    } catch {
      return response.badRequest(
        'an unexpected error occured while attemptig to create new category'
      )
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const { id } = request.params()
    const { category, subcategories, color } = await request.validate(UpdateCategoryValidator)

    if (!auth.user) return response.unauthorized()

    try {
      const categoryToUpdate = await auth.user
        .related('catagories')
        .query()
        .where('id', id)
        .firstOrFail()

      const updatedCategory = color
        ? await categoryToUpdate.merge({ category, subcategories, color }).save()
        : await categoryToUpdate.merge({ category, subcategories }).save()

      return response.json(updatedCategory)
    } catch {
      return response.unprocessableEntity({
        error: 'request could not be completed due to semantic errors',
      })
    }
  }

  public async destroy({ request, response, auth }: HttpContextContract) {
    const { id } = request.params()

    if (!auth.user) return response.unauthorized()

    const category = await auth.user.related('catagories').query().where('id', id).firstOrFail()
    await category.delete()
  }
}
