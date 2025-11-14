export type ChallengeLang = "js" | "python";

export type ChallengeDifficulty = "easy" | "intermediate" | "difficult";

export type QuestionType = "multiple choice" | "essay";

export interface BaseQuestion {
  text: string;
  type: QuestionType;
  answer: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  options: string[];
}

export type Question = MultipleChoiceQuestion;

export interface Challenge {
  _id: string;
  name: string;
  lang: ChallengeLang;
  author: string;
  createdAt: number;
  updatedAt: number;
  difficulty: ChallengeDifficulty;
  questions: Question[];
}

export type LeaderboardEntry = {
  uid: string;
  score: number;
  finishedAt: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
};
