import express from 'express'
import { QuizController } from '../../controllers/quiz.controller'
import { checkPermission } from '../../middlewares/permission.middleware'
import { Permissions } from '../../constants'

const quizRouter = express.Router()

quizRouter.post('/create', QuizController.create)
quizRouter.put('/update-quiz', QuizController.updateQuiz)
quizRouter.put('/update-question', QuizController.updateQuestion)

export default quizRouter