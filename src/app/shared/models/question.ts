export interface Question {
  question: string;
  questionId: string;
  options: options[];
  next: string;
}

export interface options {
  answer: string;
  isCorrect: boolean;
  id: string;
}
