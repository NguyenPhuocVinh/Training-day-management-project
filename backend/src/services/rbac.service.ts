import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error.util';
import { Role } from '../models/admin/role.model';
import { Permission } from '../models/admin/permission.model';
import { IPermission, IRole } from '../types/global';

export class RbacService {
    static async addPermissionToRole(roleId: string, permissionId: string) {
        const role = await Role.findById(roleId);
        if (!role) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Role not found');
        }

        const permission = await Permission.findById(permissionId);
        if (!permission) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Permission not found');
        }

        if (!role.permissions.includes(permissionId)) {
            role.permissions.push(permissionId);
        } else {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Permission already exists in role');
        }

        await role.save();
        return { message: 'Add permission to role success' };
    }

    static async removePermissionFromRole(roleId: string, permissionId: string) {
        const role = await Role.findById(roleId);
        if (!role) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Role not found');
        }

        const permission = await Permission.findById(permissionId);
        if (!permission) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Permission not found');
        }

        if (role.permissions.includes(permissionId)) {
            role.permissions = role.permissions.filter((id) => id !== permissionId);
        } else {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Permission does not exist in role');
        }

        await role.save();
        return { message: 'Remove permission from role success' };
    }

    static createPermission(permission: IPermission) {
        return Permission.create(permission);
    }

    static async createRole(role: IRole) {
        return Role.create(role);
    }

    static async getRoles() {
        return Role.find().populate('permissions');
    }
}
