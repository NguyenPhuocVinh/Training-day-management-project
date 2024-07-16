import express from 'express'
import facilityRoute from './facility.route'
import classRouter from './class.route'
import authRouter from './auth.route'
import programRouter from './program.route'
import rbacRoute from './rbac.route'
import adminRoute from './admin.route'
import categoryRouter from './category.route'
import participationRouter from './participation.route'
import attendanceRouter from './attendance.route'
import pointTransactionRouter from './point_transcaction.route'
import evidenceRouter from './evidence.route'
import { authMiddleware } from '../../middlewares/auth.middleware'
const apiRouter = express.Router()

apiRouter.use('/facility', facilityRoute)
apiRouter.use('/class', classRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/admin', adminRoute)
apiRouter.use('/program', authMiddleware, programRouter)
apiRouter.use('/rbac', rbacRoute)
apiRouter.use('/category', authMiddleware, categoryRouter)
apiRouter.use('/participation', authMiddleware, participationRouter)
apiRouter.use('/attendance', authMiddleware, attendanceRouter)
apiRouter.use('/point-transaction', authMiddleware, pointTransactionRouter)
apiRouter.use('/evidence', authMiddleware, evidenceRouter)

export default apiRouter