import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateTransactionValidator } from 'App/Validators/TransactionValidator'
import { DateTime } from 'luxon'

export default class TransactionsController {
  public async index({ response, auth }: HttpContextContract) {
    if (!auth.user) return response.unauthorized()

    const transactions = await auth.user
      .related('transactions')
      .query()
      .preload('category')
      .preload('subcategory')
      .orderBy('date', 'desc')

    return response.json(transactions)
  }

  public async show({ request, response, auth }: HttpContextContract) {
    const { id } = request.params()

    if (!auth.user) return response.unauthorized()

    try {
      const transaction = await auth.user
        .related('transactions')
        .query()
        .preload('category')
        .preload('subcategory')
        .where('id', id)
        .firstOrFail()

      return response.json(transaction)
    } catch {
      return response.unprocessableEntity({
        error: 'request could not be completed due to semantic errors',
      })
    }
  }

  public async create({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return response.unauthorized()

    const payload = await request.validate(CreateTransactionValidator)

    try {
      let transaction = await auth.user
        .related('transactions')
        .create({ ...payload, date: DateTime.fromFormat(payload.date, 'yyyy-MM-dd') })

      transaction = await auth.user
        .related('transactions')
        .query()
        .preload('category')
        .preload('subcategory')
        .where('id', transaction.id)
        .firstOrFail()

      return response.json(transaction)
    } catch {
      return response.badRequest()
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const { id } = request.params()
    const payload = await request.validate(CreateTransactionValidator)

    if (!auth.user) return response.unauthorized()

    try {
      const transacton = await auth.user
        .related('transactions')
        .query()
        .where('id', id)
        .firstOrFail()

      let updatedTransaction = await transacton
        .merge({ ...payload, date: DateTime.fromFormat(payload.date, 'yyyy-MM-dd') })
        .save()

      updatedTransaction = await auth.user
        .related('transactions')
        .query()
        .preload('category')
        .preload('subcategory')
        .where('id', updatedTransaction.id)
        .firstOrFail()

      response.json(updatedTransaction)
    } catch {
      return response.unprocessableEntity({
        error: 'request could not be completed due to semantic errors',
      })
    }
  }

  public async destroy({ request, response, auth }: HttpContextContract) {
    const { id } = request.params()

    if (!auth.user) return response.unauthorized()

    const transaction = await auth.user
      .related('transactions')
      .query()
      .where('id', id)
      .firstOrFail()

    await transaction.delete()
  }
}
