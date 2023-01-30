import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class CreateCategoryValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    category: schema.string([
      rules.alpha({ allow: ['space'] }),
      rules.trim(),
      rules.maxLength(100),
    ]),
    subcategories: schema.array
      .optional()
      .members(
        schema.string([rules.alpha({ allow: ['space'] }), rules.trim(), rules.maxLength(100)])
      ),
  })
}

export class UpdateCategoryValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    category: schema.string([
      rules.alpha({ allow: ['space'] }),
      rules.trim(),
      rules.maxLength(100),
    ]),
    subcategories: schema.array.optional().members(
      schema.object().members({
        id: schema.number.optional([rules.unsigned()]),
        subcategory: schema.string([
          rules.alpha({ allow: ['space'] }),
          rules.trim(),
          rules.maxLength(100),
        ]),
      })
    ),
  })
}
