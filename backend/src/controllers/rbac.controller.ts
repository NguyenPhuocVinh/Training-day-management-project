import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { RbacService } from '../services/rbac.service'
import { IPermission, IRole } from '../types/global'

export class RbacController {
    static async addPermissionToRole(req: Request, res: Response) {
        try {
            const { roleId, permissionId } = req.body
            if (!roleId || !permissionId) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'MISSING REQUEST')
            }
            const result = await RbacService.addPermissionToRole(roleId, permissionId)
            res.status(StatusCodes.OK).json(result)
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async removePermissionFromRole(req: Request, res: Response) {
        try {
            const { roleId, permissionId } = req.body
            if (!roleId || !permissionId) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'MISSING REQUEST')
            }
            const result = await RbacService.removePermissionFromRole(roleId, permissionId)
            res.status(StatusCodes.OK).json(result)
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async createPermission(req: Request, res: Response) {
        const permission: IPermission = req.body
        const newPermission = await RbacService.createPermission(permission)
        res.status(StatusCodes.CREATED).json(newPermission)
    }

    static async createRole(req: Request, res: Response) {
        try {
            const role: IRole = req.body
            const newRole = await RbacService.createRole(role)
            res.status(StatusCodes.CREATED).json(newRole)
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async getRoles(req: Request, res: Response) {
        const roles = await RbacService.getRoles()
        res.status(StatusCodes.OK).json(roles)
    }
}