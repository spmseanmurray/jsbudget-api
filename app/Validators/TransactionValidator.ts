import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TransactionType from 'App/Enum/TransactionType'

export default class TransactionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.enum(Object.values(TransactionType)),
    amount: schema.number([rules.range(0, 1000000)]),
    date: schema.date(),
    description: schema.string([rules.alphaNum(), rules.trim()]),
    category: schema.string([rules.alpha(), rules.trim()]),
    subcategory: schema.string.nullable([rules.alpha(), rules.trim()]),
  })
}
