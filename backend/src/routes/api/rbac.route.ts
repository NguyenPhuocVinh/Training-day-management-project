import express from 'express'
import { RbacController } from '../../controllers/rbac.controller'

const rbacRoute = express.Router()

rbacRoute.post('/add-permission-to-role', RbacController.addPermissionToRole)
rbacRoute.post('/remove-permission-from-role', RbacController.removePermissionFromRole)
rbacRoute.post('/create-permission', RbacController.createPermission)
rbacRoute.post('/create-role', RbacController.createRole)
rbacRoute.get('/roles', RbacController.getRoles)

export default rbacRoute
