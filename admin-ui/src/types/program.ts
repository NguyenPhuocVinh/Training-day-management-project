export interface IProgram {
    _id: any
    programName: string
    image: string
    quantity: number
    description: string
    registerDate: Date
    endRegisterDate: Date
    startDate: Date
    status: string
    point: number
    isMinus: boolean
    adminId: any
    categoryId: any
}

export interface ICategory {
    _id: any
    categoryName: string
}
