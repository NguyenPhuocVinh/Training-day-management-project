import mongoose from 'mongoose'
import { dbConfig } from '../configs/app.config'

export class InitMongoDB {
    static async connect() {
        try {
            await mongoose.connect(dbConfig.url)
            console.log('Connected to MongoDB')
        } catch (error) {
            console.error('Error connecting to MongoDB:', error)
        }
    }
}