import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { Program } from '../models/program.model'
import { IProgram } from '../types/global'


const isValidQuantity = (value: number): boolean => value > 0;

const validateDate = (date: Date, referenceDate: Date, errorMessage: string): void => {
    if (date < referenceDate) {
        throw new ApiError(StatusCodes.BAD_REQUEST, errorMessage);
    }
};

export class ProgramService {
    static async create(program: IProgram) {
        const { quantity, registerDate, endRegisterDate, startDate } = program;

        if (!isValidQuantity(quantity as number)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Quantity must be greater than 0');
        }

        const today = new Date();

        validateDate(registerDate, today, 'Register date must be greater than today');
        validateDate(endRegisterDate, registerDate, 'End register date must be greater than register date');
        validateDate(startDate, endRegisterDate, 'Start date must be greater than end register date');

        return await Program.create(program);
    }

    static async update(programId: string, program: IProgram) {
        const updatedProgram = await Program.findByIdAndUpdate
            (programId, program, { new: true })
        return updatedProgram

    }

    static async delete(programId: string) {
        return await Program.findByIdAndDelete(programId)
    }

    static async approve(programId: string) {
        const approvedProgram = await Program.findByIdAndUpdate
            (programId, { status: 'approved' }, { new: true })
        return approvedProgram
    }

    static async reject(programId: string) {
        const rejectedProgram = await Program.findByIdAndUpdate
            (programId, { status: 'rejected' }, { new: true })
        return rejectedProgram
    }

    static async getPrograms() {
        return await Program.find()
            .populate({
                path: 'adminId',
                populate: { path: 'facilityId', select: 'facilityName' }
            })
            .populate('categoryId', 'categoryName')
            .lean()
            .exec();
    }

    static async getProgramById(programId: string) {
        return await Program.findById(programId).populate({
            path: 'adminId',
            populate: { path: 'facilityId', select: 'facilityName' }
        })
            .populate('categoryId', 'categoryName')
            .lean()
            .exec();
    }
}