import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Role } from '../models/admin/role.model';

export const checkPermission = (requiredPermission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const adminRoleId = req.user.roleId
            const role = await Role.findById(adminRoleId).populate('permissions')

            if (!role) {
                return res.status(StatusCodes.FORBIDDEN).json({ message: 'Role denied' });
            }

            const hasPermission = role.permissions.some(
                (permission: any) => permission.permissionName === requiredPermission
            );

            if (!hasPermission) {
                return res.status(StatusCodes.FORBIDDEN).json({ message: 'Permission denied' })
            }

            next()
        } catch (error: any) {
            console.log(error)
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    };
};