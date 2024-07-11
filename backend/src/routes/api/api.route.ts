import express from 'express'
import facilityRoute from './facility.route'
import classRouter from './class.route'
import authRouter from './auth.route'
import programRouter from './program.route'
import rbacRoute from './rbac.route'
import adminRoute from './admin.route'
import categoryRouter from './category.route'
import { authMiddleware } from '../../middlewares/auth.middleware'
const apiRouter = express.Router()

apiRouter.use('/facility', facilityRoute)
apiRouter.use('/class', classRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/admin', adminRoute)
apiRouter.use('/program', authMiddleware, programRouter)
apiRouter.use('/rbac', rbacRoute)
apiRouter.use('/category', authMiddleware, categoryRouter)

export default apiRouter