import mongoose, { Document, Schema, model } from 'mongoose';
import { IFacility } from '../types/global';

interface FacilityDocument extends IFacility, Document { }

const FacilitySchema = new Schema<FacilityDocument>({
    facilityName: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Facility = model<FacilityDocument>('Facility', FacilitySchema);
