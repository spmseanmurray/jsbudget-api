import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return 'OK'
})

Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.post('/logout', 'AuthController.logout')
}).prefix('auth')

Route.group(() => {
  Route.get('/', 'UsersController.index')
  Route.get('/:id', 'UsersController.show')
  Route.post('/:id', 'UsersController.update')
  Route.delete('/:id', 'UsersController.destroy')
})
  .prefix('users')
  .middleware(['auth', 'role:admin'])
