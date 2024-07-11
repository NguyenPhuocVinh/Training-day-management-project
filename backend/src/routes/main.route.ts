import express from 'express'
import apiRouter from './api/api.route'

const mainRoute = express.Router()

mainRoute.use('/api/v1', apiRouter)

export default mainRoute