import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TransactionType from 'App/Enum/TransactionType'

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
      .members(schema.string([rules.trim(), rules.maxLength(100)])),
    color: schema.string([rules.minLength(6), rules.maxLength(7)]),
    type: schema.enum(Object.values(TransactionType)),
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
    subcategories: schema.array
      .optional()
      .members(schema.string([rules.trim(), rules.maxLength(100)])),
    color: schema.string.optional([rules.minLength(6), rules.maxLength(7)]),
  })
}
