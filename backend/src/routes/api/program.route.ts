import express from 'express'
import { ProgramController } from '../../controllers/program.controller'
import { checkPermission } from '../../middlewares/permission.middleware'
import { Permissions } from '../../constants'
const programRouter = express.Router()
programRouter.post('/create', checkPermission(Permissions.CREATE_PROGRAM), ProgramController.create)
programRouter.put('/update', checkPermission(Permissions.UPDATE_PROGRAM), ProgramController.update)
programRouter.delete('/delete', checkPermission(Permissions.DELETE_PROGRAM), ProgramController.delete)
programRouter.put('/approve', checkPermission(Permissions.APPROVE_PROGRAM), ProgramController.approve)
programRouter.put('/reject', checkPermission(Permissions.REJECT_PROGRAM), ProgramController.reject)
programRouter.get('/get-programs', ProgramController.getPrograms)
programRouter.get('/get-program-by-id', ProgramController.getProgramById)

export default programRouter