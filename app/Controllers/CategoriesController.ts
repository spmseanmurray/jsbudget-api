import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateCategoryValidator, UpdateCategoryValidator } from 'App/Validators/CategoryValidator'

export default class CategoriesController {
  public async index({ response, auth }: HttpContextContract) {
    if (!auth.user) return response.unauthorized()

    const categories = await auth.user.related('catagories').query().preload('subcategories')

    return response.json(categories)
  }

  public async show({ request, response, auth }: HttpContextContract) {
    const { id } = request.params()

    if (!auth.user) return response.unauthorized()

    try {
      const category = await auth.user
        .related('catagories')
        .query()
        .preload('subcategories')
        .where('id', id)
        .firstOrFail()

      return response.json(category)
    } catch {
      return response.unprocessableEntity({
        error: 'request could not be completed due to semantic errors',
      })
    }
  }

  public async create({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return response.unauthorized()

    const { category, subcategories, color } = await request.validate(CreateCategoryValidator)

    const createdCategory = await auth.user.related('catagories').create({ category, color })

    if (subcategories) {
      const createdSubcategories = await createdCategory.related('subcategories').createMany(
        subcategories.map((subcategory) => {
          return { subcategory }
        })
      )

      return response.json(Object.assign(createdCategory, { subcategories: createdSubcategories }))
    }

    return response.json(createdCategory)
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const { id } = request.params()
    const { category, subcategories, color } = await request.validate(UpdateCategoryValidator)

    if (!auth.user) return response.unauthorized()

    try {
      const categoryToUpdate = await auth.user
        .related('catagories')
        .query()
        .preload('subcategories')
        .where('id', id)
        .firstOrFail()

      const updatedCategory = color
        ? await categoryToUpdate.merge({ category, color }).save()
        : await categoryToUpdate.merge({ category }).save()

      if (subcategories) {
        const updatedSubcategories = await Promise.all(
          subcategories.map(async (subcategory) => {
            // update existing subcategory when id is available
            if (subcategory.id) {
              const categoryToUpdate = await updatedCategory
                .related('subcategories')
                .query()
                .where('id', subcategory.id)
                .firstOrFail()

              categoryToUpdate.subcategory = subcategory.subcategory
              return await categoryToUpdate.save()
            }
            // otherwise create new subcategory
            return await updatedCategory
              .related('subcategories')
              .create({ subcategory: subcategory.subcategory })
          })
        )

        return response.json(
          Object.assign(updatedCategory, { subcategories: updatedSubcategories })
        )
      }

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
