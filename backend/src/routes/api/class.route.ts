import express from 'express'
import { ClassController } from '../../controllers/class.controller'

const classRouter = express.Router()

classRouter.post('/create', ClassController.Create)
classRouter.put('/update', ClassController.Update)
classRouter.delete('/delete', ClassController.Delete)
classRouter.get('/get/:facilityId', ClassController.Get)
classRouter.get('/get', ClassController.GetAll)

export default classRouter