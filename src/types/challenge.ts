export type ChallengeLang = "js" | "python";

export type ChallengeDifficulty = "easy" | "intermediate" | "difficult";

export type QuestionType = "multiple choice" | "essay";

export interface BaseQuestion {
  text: string;
  type: QuestionType;
  answer: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple choice";
  options: string[];
}

export interface EssayQuestion extends BaseQuestion {
  type: "essay";
}

export type Question = MultipleChoiceQuestion | EssayQuestion;

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
