import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { Facility } from '../models/facility.model'
import { FacilityRequestBody } from '../types/request/facility.request'

export class FacilityService {
    static async Create(facilityRequestBody: FacilityRequestBody) {
        const { facilityName } = facilityRequestBody
        const newFacility = await Facility.create({ facilityName })
        return newFacility
    }

    static async Update(facilityId: string, payload: any) {
        const updatedFacility = await Facility.findByIdAndUpdate(
            facilityId,
            payload,
            {
                new: true,
            }
        );
        if (!updatedFacility) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Facility not found')
        }
        return updatedFacility;
    }

    static async Delete(facilityId: string) {
        const deletedFacility = await Facility.findByIdAndDelete(facilityId)
        if (!deletedFacility) throw new ApiError(StatusCodes.NOT_FOUND, 'Facility not found')
        return deletedFacility
    }

    static async Get(facilityId: string) {
        const facility = await Facility.findById(facilityId)
        if (!facility) throw new ApiError(StatusCodes.NOT_FOUND, 'Facility not found')
        return facility
    }

    static async GetAll() {
        return Facility.find().lean()
    }
}