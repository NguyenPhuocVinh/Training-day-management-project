import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { Category } from '../models/category.model'
import { ICategory } from '../types/global'

export class CategoryService {
    static async create(category: ICategory) {
        return await Category.create(category)
    }

    static async update(categoryId: string, category: ICategory) {
        const updatedCategory = await Category.findByIdAndUpdate
            (categoryId, category, { new: true })
        return updatedCategory
    }

    static async delete(categoryId: string) {
        return await Category.findByIdAndDelete(categoryId)
    }

    static async getCategories() {
        return await Category.find()
    }

    static async getCategoryById(categoryId: string) {
        return await Category.findById(categoryId)
    }
}