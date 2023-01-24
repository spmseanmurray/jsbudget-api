import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { string } from '@ioc:Adonis/Core/Helpers'
import User from './User'

type TokenType = 'PASSWORD_RESET' | 'VERIFY_EMAIL'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number | null

  @column()
  public type: string

  @column()
  public token: string

  @column.dateTime()
  public expiresAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  public static async generateVerifyEmailToken(user: User) {
    const token = string.generateRandom(64)

    await Token.expireTokens(user, 'VERIFY_EMAIL')
    const record = await user.related('tokens').create({
      type: 'VERIFY_EMAIL',
      expiresAt: DateTime.now().plus({ hours: 24 }),
      token,
    })

    return record.token
  }

  public static async generatePasswordResetToken(user: User) {
    const token = string.generateRandom(64)

    await Token.expireTokens(user, 'PASSWORD_RESET')
    const record = await user.related('tokens').create({
      type: 'PASSWORD_RESET',
      expiresAt: DateTime.now().plus({ minutes: 30 }),
      token,
    })

    return record.token
  }

  public static async expireTokens(user: User, type: TokenType) {
    await (
      await user
        .related('tokens')
        .query()
        .where('type', type)
        .where('expiresAt', '>', DateTime.now().toSQL())
    ).forEach(async (Token) => {
      await Token.merge({ expiresAt: DateTime.now() }).save()
    })
  }

  public static async getTokenUser(token: string, type: TokenType) {
    const record = await Token.query()
      .preload('user')
      .where('token', token)
      .where('type', type)
      .where('expiresAt', '>', DateTime.now().toSQL())
      .orderBy('createdAt', 'desc')
      .first()

    return record?.user
  }

  public static async verify(token: string, type: TokenType) {
    const record = await Token.query()
      .where('expiresAt', '>', DateTime.now().toSQL())
      .where('token', token)
      .where('type', type)
      .first()

    return !!record
  }
}
