export interface Question{
  "Question": string,
  "QuestionId": string,
  "options": options[],
  "next": string
}

export interface options{
  "answer": string,
  "isCorrect": boolean,
  "id":string

}
