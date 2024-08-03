import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { ICategory } from '../types/global'
import { CategoryService } from '../services/category.service'

export class CategoryController {
    static async create(req: Request, res: Response) {
        const category: ICategory = req.body
        const newCategory = await CategoryService.create(category)
        res.status(StatusCodes.CREATED).json(newCategory)
    }

    static async update(req: Request, res: Response) {
        const categoryId = req.query.categoryId as string
        const category: ICategory = req.body
        const updatedCategory = await CategoryService.update(categoryId, category)
        res.status(StatusCodes.OK).json(updatedCategory)
    }

    static async delete(req: Request, res: Response) {
        const categoryId = req.query.categoryId as string
        const deletedCategory = await CategoryService.delete(categoryId)
        res.status(StatusCodes.OK).json(deletedCategory)
    }

    static async getCategories(req: Request, res: Response) {
        const categories = await CategoryService.getCategories()
        res.status(StatusCodes.OK).json({ categories })
    }

    static async getCategoryById(req: Request, res: Response) {
        const categoryId = req.query.categoryId as string
        const category = await CategoryService.getCategoryById(categoryId)
        res.status(StatusCodes.OK).json(category)
    }
}