import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import TransactionType from 'App/Enum/TransactionType'
import Category from './Category'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public type: TransactionType

  @column()
  public amount: number

  @column()
  public date: DateTime

  @column()
  public description: string

  @column()
  public category: string

  @column()
  public subcategory: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Category)
  public categories: HasMany<typeof Category>
}
