export interface UserAnswerReq {
    userQuizId: string;
    answers: {
        questionId: string;
        answer: string;
    }[];
}