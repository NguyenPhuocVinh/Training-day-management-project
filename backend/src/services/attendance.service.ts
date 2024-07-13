import { Attendance } from '../models/attendance.model'
import { IAttendance } from '../types/global'
import { ApiError } from '../utils/api-error.util'
import { StatusCodes } from 'http-status-codes'

export class AttendanceService {
    static async scanQRCodeCheckIn(participationId: string) {
        const checkIn = new Date()
        const attendance = new Attendance({ participationId, checkIn })
        await attendance.save()
        return attendance
    }

    static async scanQRCodeCheckOut(participationId: string) {
        const attendance = await Attendance.findOne({ participationId, checkOut: null })
        if (!attendance) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Attendance not found')
        }
        attendance.checkOut = new Date()
        await attendance.save()
        return attendance
    }


}