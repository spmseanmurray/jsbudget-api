import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return 'OK'
})

Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.post('/logout', 'AuthController.logout')
  Route.get('/verify-email/:token', 'VerifyEmailController.verify')
  Route.post('/password-reset/send', 'PasswordResetController.send')
  Route.get('/password-reset/:token', 'PasswordResetController.verify')
  Route.post('/password-reset', 'PasswordResetController.reset')
}).prefix('auth')

Route.group(() => {
  Route.get('/', 'UsersController.index')
  Route.get('/:id', 'UsersController.show')
  Route.post('/:id', 'UsersController.update')
  Route.delete('/:id', 'UsersController.destroy')
})
  .prefix('users')
  .middleware(['auth', 'role:admin'])
