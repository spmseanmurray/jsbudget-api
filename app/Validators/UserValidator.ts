import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string([
      rules.email(),
      rules.trim(),
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
    ]),
    password: schema.string([rules.minLength(8)]),
    firstName: schema.string([rules.trim()]),
    lastName: schema.string([rules.trim()]),
  })
}
export class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string.optional([
      rules.email(),
      rules.trim(),
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
    ]),
    password: schema.string.optional([rules.minLength(8)]),
    firstName: schema.string.optional([rules.trim()]),
    lastName: schema.string.optional([rules.trim()]),
  })
}
export class ResetUserPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    token: schema.string([
      rules.exists({ table: 'tokens', column: 'token', caseInsensitive: true }),
    ]),
    email: schema.string([
      rules.email(),
      rules.trim(),
      rules.exists({ table: 'users', column: 'email', caseInsensitive: true }),
    ]),
    password: schema.string([rules.minLength(8)]),
  })
}
