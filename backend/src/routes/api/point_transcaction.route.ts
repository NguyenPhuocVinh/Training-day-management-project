import express from 'express'
import { PointTransactionController } from '../../controllers/point_transaction.controller'
import { Permissions } from '../../constants'
import { checkPermission } from '../../middlewares/permission.middleware'

const pointTransactionRouter = express.Router()

// pointTransactionRouter.post('/', checkPermission(Permissions.CREATE_POINT_TRANSACTION), PointTransactionController.create)
pointTransactionRouter.post('/penalize-non-participants', PointTransactionController.penalizeNonParticipants)
pointTransactionRouter.post('/reward-participants', PointTransactionController.rewardParticipants)

export default pointTransactionRouter
