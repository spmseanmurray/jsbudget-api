import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  column,
  computed,
  beforeSave,
  belongsTo,
  BelongsTo,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Token from './Token'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public roleId: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public rememberMeToken: string | null

  @column()
  public isEmailVerified: boolean = false

  @computed()
  public get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
