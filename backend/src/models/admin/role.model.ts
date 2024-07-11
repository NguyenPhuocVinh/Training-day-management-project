import mongoose, { Schema, Document, model } from 'mongoose';
import { IRole } from '../../types/global';

interface RoleDocument extends Document, IRole { }

const RoleSchema = new Schema<RoleDocument>({
    roleName: {
        type: String,
        required: true,
        unique: true
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Permission',
        required: true
    }]
}, { timestamps: true });

export const Role = model<RoleDocument>('Role', RoleSchema);
