import express from 'express'
import { AuthController } from '../../controllers/auth.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { checkPermission } from '../../middlewares/permission.middleware'
import { Permissions } from '../../constants'

const authRoute = express.Router()

// authRoute.post('/register-admin', AuthController.adminRegister)
// authRoute.post('/login-admin', AuthController.adminLogin)
authRoute.post('/register', AuthController.userRegister)
authRoute.post('/login', AuthController.userLogin)
authRoute.post('/logout', authMiddleware, AuthController.logout)
authRoute.post('/forgot-password', AuthController.forgotPassword)
authRoute.put('/reset-password', AuthController.resetPassword)
authRoute.get('/test', authMiddleware, checkPermission(Permissions.CREATE_USER), (req, res) => res.json({ message: 'Hello' }))

export default authRoute