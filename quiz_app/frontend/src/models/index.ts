export interface Quiz {
  _id: string;
  name: string;
  description: string;
  difficulty: string;
  negativePoints: boolean;
  timeForQuestion: number;
  randomQuestionsPlacement: boolean;
  randomAnswersPlacement: boolean;
  noReturn: boolean;
  questions: Question[];
  ranking: Ranking[];
}

export interface Question {
  _id: string;
  type: string;
  question: string;
  correctAnswer: string[];
  answers: string[];
}

export interface Ranking {
  _id: string;
  quizId: string;
  playerName: string;
  score: number;
  date: string;
}
