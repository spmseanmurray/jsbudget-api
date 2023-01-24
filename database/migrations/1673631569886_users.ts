import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from 'App/Enum/Roles'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('role_id').unsigned().references('id').inTable('roles').defaultTo(Roles.USER)
      table.string('email')
      table.string('password')
      table.string('first_name')
      table.string('last_name')
      table.string('remember_me_token').nullable()
      table.boolean('is_email_verified').notNullable().defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
