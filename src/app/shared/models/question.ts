export interface Question{
  "Question": string,
  "QuestionId": string,
  "options": options[]
}

export interface options{
  "answer": string,
  isCorrect: boolean
}
