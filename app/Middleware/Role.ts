import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Roles from 'App/Enum/Roles'

export default class Role {
  public async handle(
    { response, auth }: HttpContextContract,
    next: () => Promise<void>,
    guards: string[]
  ) {
    const roleIds = guards.map((guard) => Roles[guard.toUpperCase()])

    if (!roleIds.includes(auth.user?.roleId)) {
      return response.unauthorized({
        error: `Role requirements not met. Must include ${guards.join('/')}`,
      })
    }

    await next()
  }
}
