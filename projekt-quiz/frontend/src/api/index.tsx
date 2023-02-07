import axios from 'axios';
import { Quiz, Ranking } from '../models';

const baseUrl = 'http://localhost:5000';

export const getQuizzes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/quizzes`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
export const getQuiz = async (id: string) => {
  try {
    const response = await axios.get(`${baseUrl}/quizzes/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
  
export const createQuiz = async (quiz: Quiz) => {
  try {
    const response = await axios.post(`${baseUrl}/quizzes`, quiz);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const updateQuiz = async (id: string, quiz: Quiz) => {
  try {
    const response = await axios.put(`${baseUrl}/quizzes/edit/${id}`, quiz);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const deleteQuiz = async (id: string) => {
  try {
    await axios.delete(`${baseUrl}/quizzes/${id}`);
  } catch (error) {
    console.error(error);
  }
};

export const createRanking = async (id: string, ranking: Ranking) => {
  try {
    const response = await axios.patch(`${baseUrl}/quizzes/play/${id}`, ranking);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
