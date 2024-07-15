import express from 'express'
import { AttendanceController } from '../../controllers/attendance.controller'
import { checkPermission } from '../../middlewares/permission.middleware'
import { Permissions } from '../../constants'

const attendanceRouter = express.Router()

attendanceRouter.post('/check-in/scan', checkPermission(Permissions.ATTENDANCE_MANAGEMENT), AttendanceController.scanQRCodeCheckIn)
attendanceRouter.post('/check-out/scan', checkPermission(Permissions.ATTENDANCE_MANAGEMENT), AttendanceController.scanQRCodeCheckOut)
attendanceRouter.post('/check-in', checkPermission(Permissions.ATTENDANCE_MANAGEMENT), AttendanceController.manualCheckIn)
attendanceRouter.post('/check-out', checkPermission(Permissions.ATTENDANCE_MANAGEMENT), AttendanceController.manualCheckOut)
export default attendanceRouter