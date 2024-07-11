import mongoose, { Document, model, Schema } from 'mongoose';
import { IPermission } from '../../types/global';

interface PermissionDocument extends IPermission, Document { }

const PermissionSchema = new Schema<PermissionDocument>({
    permissionName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Permission = model<PermissionDocument>('Permission', PermissionSchema);
