import express from 'express'
import { CategoryController } from '../../controllers/category.controller'
import { checkPermission } from '../../middlewares/permission.middleware'
import { Permissions } from '../../constants'

const categoryRouter = express.Router()

categoryRouter.get('/get-categories', CategoryController.getCategories)
categoryRouter.get('/get-category-by-id', CategoryController.getCategoryById)
categoryRouter.post('/create', checkPermission(Permissions.CREATE_CATEGORY), CategoryController.create)
categoryRouter.put('/update', checkPermission(Permissions.UPDATE_CATEGORY), CategoryController.update)
categoryRouter.delete('/delete', checkPermission(Permissions.DELETE_CATEGORY), CategoryController.delete)

export default categoryRouter
