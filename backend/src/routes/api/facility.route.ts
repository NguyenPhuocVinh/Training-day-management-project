import express from 'express'
import { FacilityController } from '../../controllers/facility.controller'

const facilityRoute = express.Router()

facilityRoute.post('/create', FacilityController.Create)
facilityRoute.put('/update', FacilityController.Update)
facilityRoute.delete('/delete', FacilityController.Delete)
facilityRoute.get('/get/:facilityId', FacilityController.Get)
facilityRoute.get('/get', FacilityController.GetAll)

export default facilityRoute