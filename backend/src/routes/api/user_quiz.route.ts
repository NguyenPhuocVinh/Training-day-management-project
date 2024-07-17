import express from 'express'

import { UserQuizController } from '../../controllers/user_quiz.controller'

const userQuizRoute = express.Router()

userQuizRoute.post('/start', UserQuizController.startQuiz)
userQuizRoute.post('/submit', UserQuizController.submitQuiz)
userQuizRoute.get('/get-questions', UserQuizController.getQuestionByQuizId)

export default userQuizRoute