import { ObjectId } from 'mongoose'


// * Facility
interface IFacility {
    facilityName: string
}

// * Class
interface IClass {
    className: string
    facilityId: ObjectId
}

// * User
interface IUser {
    MSSV: string
    fullName: string
    email: string
    password: string
    birthDay: Date
    gender: Boolean
    point: Number
    classId: ObjectId
}

interface IToken {
    userId?: any
    adminId?: any
    token: string
    type: string
    expiresTime: Date
}

// * Notification
interface INotification {
    title: string
    message: string
    attach: string
}

interface IUserNotification {
    userId: ObjectId
    notificationId: ObjectId
    isRead: Boolean
}

// * Admin
interface IAdmin {
    fullName: string
    email: string
    password: string
    facilityId: ObjectId
    roleId: ObjectId
}

interface ITokenAdmin {
    adminId: any
    token: string
    type: string
    expiresTime: Date
}

// * Role
interface IRole {
    roleName: string
    permissions: any[]
}

interface IRolePermission {
    roleId: ObjectId
    permissionId: ObjectId
}

interface IPermission {
    permissionName: string
    description: string
}

// * Category
interface ICategory {
    categoryName: string
    isPropose: Boolean
}

// * Program
interface IProgram {
    programName: string
    image: string
    quantity: Number
    description: string
    registerDate: Date
    endRegisterDate: Date
    startDate: Date
    status: string
    point: Number
    isMinus: Boolean
    adminId: any
    categoryId: any
}

// * Quiz
interface IQuiz {
    quizName: string
    programId: any
    duration: Number
    quantityQuestion: Number
    requiredCorrectAnswer: Number
    status: string
    startTime: Date
    endTime: Date
}

interface IQuestion {
    quizId: any
    question: string
    imageQuestion?: string
    answers: string[]
    correctAnswer: Number
}

interface IUserQuiz {
    participationId: any
    quizId: any
    completed: Date
    correctAnswer: Number,
}

interface IUserAnswer {
    userQuizId: any
    questionId: any
    answer: Number
}


// * Participation
interface IParticipation {
    userId: any
    programId: any
    status: string
    qrCode: string
    penalized: Boolean
    pointsRewarded: Boolean
}

// * PointTransaction
interface IPointTransaction {
    participationId: any
    point: Number
    type: string
    description: string
}

// * Attendance
interface IAttendance {
    participationId: any
    checkIn: Date
    checkOut: Date
}

// * Evidence
interface IEvidence {
    participationId: any
    image: string
    submitDate: Date
    feedback: string
    feedbackDate: Date
    status: string
    feedbackAdminId: any
}