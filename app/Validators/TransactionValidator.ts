import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TransactionType from 'App/Enum/TransactionType'

export class CreateTransactionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.enum(Object.values(TransactionType)),
    amount: schema.number([rules.range(0, 1000000)]),
    date: schema.string([rules.alphaNum({ allow: ['dash'] })]),
    description: schema.string([
      rules.alphaNum({ allow: ['dash', 'space', 'underscore'] }),
      rules.trim(),
    ]),
    categoryId: schema.number([
      rules.unsigned(),
      rules.exists({ table: 'categories', column: 'id' }),
    ]),
    subcategoryId: schema.number.nullable([
      rules.unsigned(),
      rules.exists({ table: 'subcategories', column: 'id' }),
    ]),
  })
}
