import { Question } from '../models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QuestionState {
  questions: Question[];
}

const initialState: QuestionState = {
  questions: []
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {

    createQuestion(state: QuestionState, action: PayloadAction<Question>) {
      state.questions = [...state.questions, action.payload]
    },
    deleteQuestion: (state: QuestionState, action: PayloadAction<string>) => {
      state.questions = state.questions.filter(
      question => question._id !== action.payload
      );
    },
    clearQuestion(state: QuestionState) {
      state.questions = [];
    },
  },
});

export const { createQuestion, deleteQuestion, clearQuestion } = questionSlice.actions
export default questionSlice.reducer
