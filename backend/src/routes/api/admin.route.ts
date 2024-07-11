import express from 'express'
import { AdminControler } from '../../controllers/admin.controller'

const adminRoute = express.Router()

adminRoute.post('/register', AdminControler.adminRegister)
adminRoute.post('/login', AdminControler.adminLogin)

export default adminRoute