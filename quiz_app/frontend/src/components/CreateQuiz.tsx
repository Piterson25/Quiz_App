import * as React from "react";
import { Quiz as QuizType } from '../models';
import { createQuiz } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from "react-redux";
import { RefreshContext } from './ContextRefresh';
import { createQuestion, deleteQuestion, clearQuestion } from "../reducers/questions";
import { v4 } from "uuid";
import { AppState } from "../store";

export const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const questions = useSelector((state: AppState) => state.questions.questions)

  const { refresh, setRefresh } = React.useContext(RefreshContext);
  const questionTypeOptions = ['single', 'multiple', 'truefalse', 'short', 'dropdown', 'fillblank', 'sort', 'match'];

  const [questionText, setQuestionText] = React.useState('');
  const [type, setType] = React.useState('single');

  const [tempAnswers, setTempAnswers] = React.useState([]);
  const [tempCorrectAnswer, setTempCorrectAnswer] = React.useState([]);

  const addAnswer = () => {
    setTempAnswers([...tempAnswers, '']);
  }

  const removeAnswer = (index: number) => {
    const newAnswers = tempAnswers.filter((_, i) => i !== index);
    setTempAnswers(newAnswers);
  }

  const addCorrectAnswer = () => {
    if (type !== 'truefalse') {
      setTempCorrectAnswer([...tempCorrectAnswer, '']);
    }
  }

  const removeCorrectAnswer = (index: number) => {
    if (type !== 'truefalse') {
      const newAnswers = tempCorrectAnswer.filter((_, i) => i !== index);
      setTempCorrectAnswer(newAnswers);
    }
  }

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newAnswers = [...tempAnswers];
    newAnswers[index] = e.target.value;
    setTempAnswers(newAnswers);
  }

  const handleCorrectAnswerChange = React.useMemo(() => {
    return (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      if (type !== 'truefalse') {
        const newCorrectAnswer = [...tempCorrectAnswer];
        newCorrectAnswer[index] = e.target.value;
        setTempCorrectAnswer(newCorrectAnswer);
      } else {
        setTempCorrectAnswer([e.target.value]);
      }
    }
  }, [type, tempCorrectAnswer]);

  const handleAddQuestion = () => {
    dispatch(createQuestion({
      _id: v4(),
      type: type,
      question: questionText,
      correctAnswer: tempCorrectAnswer,
      answers: tempAnswers
    }));
    setQuestionText('');
    setTempAnswers([]);
    setTempCorrectAnswer([]);
    setType('single');
  }

  return (
    <div className="min-h-screen font-bold text-center text-xl">
      <Link to="/" className="text-xl font-bold rounded-xl bg-green-500 text-white w-fit p-4 px-8 m-4 fixed left-0 top-25 hover:bg-green-600 shadow-xl">
        Return
      </Link>
      <Formik
        initialValues={{ name: '', description: '', difficulty: 'easy', negativePoints: false, timeForQuestion: 0, randomQuestionsPlacement: true, randomAnswersPlacement: true, noReturn: true }}
        onSubmit={(values) => {
          createQuiz({ ...values, questions: questions, ranking: [] } as QuizType).then(() => setRefresh(!refresh));
          dispatch(clearQuestion());
          navigate('/');
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="h-full p-4 mx-auto flex flex-col justify-center w-fit items-center">
            <label htmlFor="name">
              Name:
              <Field className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' name="name" type="text" placeholder="Enter name" required />
            </label>

            <label htmlFor="description">
              Description:
              <Field className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' name="description" type="text" placeholder="Enter description" required />
            </label>

            <label className="flex justify-center items-center" htmlFor="difficulty">
              Select difficulty:
              <div className="flex justify-center items-center m-4">
                <label htmlFor="difficulty" className="text-green-500">
                  Easy
                  <Field className='p-4 ml-2 mr-4 w-4 h-4' name="difficulty" type="radio" id="easy" value="easy" />
                </label>

                <label htmlFor="difficulty" className="text-yellow-500">
                  Medium
                  <Field className='p-4 ml-2 mr-4 w-4 h-4' name="difficulty" type="radio" id="medium" value="medium" />
                </label>

                <label htmlFor="difficulty" className="text-red-500">
                  Hard
                  <Field className='p-4 ml-2 mr-4 w-4 h-4' name="difficulty" type="radio" id="hard" value="hard" />
                </label>
              </div>
            </label>

            <label htmlFor="timeForQuestion">
              Time (0 - no time):
              <Field className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' name="timeForQuestion" min='0' type="number" placeholder="Enter timeForQuestion" required />
            </label>

            <div className="mb-8">
              <div className="flex justify-center items-center">
                <label htmlFor="negativePoints">
                  Negative points
                  <Field className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' name="negativePoints" type="checkbox" placeholder="Enter negativePoints" />
                </label>

                <label htmlFor="randomQuestionsPlacement">
                  Random questions
                  <Field className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' name="randomQuestionsPlacement" type="checkbox" placeholder="Enter randomQuestionsPlacement" />
                </label>
              </div>
              <div className="flex justify-center items-center">
                <label htmlFor="randomAnswersPlacement">
                  Random answers
                  <Field className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' name="randomAnswersPlacement" type="checkbox" placeholder="Enter randomAnswersPlacement" />
                </label>

                <label htmlFor="noReturn">
                  No return
                  <Field className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' name="noReturn" type="checkbox" placeholder="Enter noReturn" />
                </label>
              </div>
            </div>

            <div className="question-list">
              {questions.map((q, index) => (
                <div key={index} className="question-item">
                  <p>{`Type: ${q.type}`}</p>
                  <p>{`Question: ${q.question}`}</p>
                  <p>{`Correct Answer: ${q.correctAnswer}`}</p>
                  <p>{`Answers: ${q.answers.join(', ')}`}</p>
                  <button className="text-xl font-bold rounded-xl bg-red-500 text-white w-fit p-4 px-8 m-4 hover:bg-red-600 shadow-xl" type="button" onClick={() => {
                    dispatch(deleteQuestion(q._id));
                  }}>
                    Remove question
                  </button>
                </div>
              ))}
            </div>

            <label htmlFor="type">
              Select question type:
              <Field className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' as="select" name="type" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value)} value={type}>
                {questionTypeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Field>
            </label>

            <label htmlFor="question">
              Question:
              <Field className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' name="question" type="text" placeholder="Enter question" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestionText(e.target.value)} value={questionText} />
              <button className="bg-green-500 text-white p-4 rounded-xl m-4 hover:bg-green-600 shadow-xl" type="button" disabled={
                questionText === '' || (type !== 'truefalse' && type !== 'short' && type !== 'fillblank' && (tempAnswers.length === 0 || tempCorrectAnswer.length === 0 || tempAnswers.some((el) => el === '') || tempCorrectAnswer.some((el) => el === '') || !tempAnswers.some(element => tempCorrectAnswer.includes(element))))
                 || (type === 'truefalse' && tempCorrectAnswer.length === 0) || (type === 'fillblank' && tempCorrectAnswer.length === 0)
              }
                onClick={handleAddQuestion}>Add question</button>
            </label>

            {type === 'truefalse' ? (
              <div>
                <input className="p-4 mx-4 w-4 h-4" type="radio" name="truefalse" value="true" onClick={() => setTempCorrectAnswer(['true'])} /> True
                <input className="p-4 mx-4 w-4 h-4" type="radio" name="truefalse" value="false" onClick={() => setTempCorrectAnswer(['false'])} /> False
              </div>
            ) : type === 'short' || type === 'fillblank' ? (
              <div>
              {tempCorrectAnswer.map((answer, index) => (
                <div key={index}>
                  <label htmlFor="correctAnswer">
                    Correct answer:
                    <Field className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' name={`correctAnswer-${index}`} type="text" placeholder="Enter correct answer" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCorrectAnswerChange(e, index)} value={answer} required />
                    <button className="bg-red-500 hover:bg-red-600 p-4 m-4 rounded-xl shadow-xl" type="button" onClick={() => removeCorrectAnswer(index)} disabled={tempCorrectAnswer.length === 0}>🗑</button>
                  </label>
                </div>
              ))}
              {tempCorrectAnswer.length === 0 ? 
                <button className="bg-green-500 text-white p-4 rounded-xl m-4 hover:bg-green-600 shadow-xl" type="button" onClick={addCorrectAnswer} >Add correct answer</button>
                :
                null
              }
              
              </div>
              ) : (
              <div>
                {tempAnswers.map((answer, index) => (
                  <div key={index}>
                    <label htmlFor="answers">
                      Answers:
                      <Field className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' name={`answers-${index}`} type="text" placeholder="Enter answer" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(e, index)} value={answer} required />
                      <button className="bg-red-500 hover:bg-red-600 p-4 m-4 rounded-xl shadow-xl" type="button" onClick={() => removeAnswer(index)} disabled={tempAnswers.length === 0}>🗑</button>
                    </label>
                  </div>
                ))}
                <button className="bg-green-500 text-white p-4 rounded-xl m-4 hover:bg-green-600 shadow-xl" type="button" onClick={addAnswer} >Add answer</button>

                {tempCorrectAnswer.map((answer, index) => (
                  <div key={index}>
                    <label htmlFor="correctAnswer">
                      Correct answer:
                      <Field className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' name={`correctAnswer-${index}`} type="text" placeholder="Enter correct answer" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCorrectAnswerChange(e, index)} value={answer} required />
                      <button className="bg-red-500 hover:bg-red-600 p-4 m-4 rounded-xl shadow-xl" type="button" onClick={() => removeCorrectAnswer(index)} disabled={tempCorrectAnswer.length === 0}>🗑</button>
                    </label>
                  </div>
                ))}
                <button className="bg-green-500 text-white p-4 rounded-xl m-4 hover:bg-green-600 shadow-xl" type="button" onClick={addCorrectAnswer} >Add correct answer</button>
              </div>
            )}

            <button type="submit" className="text-2xl block bg-green-500 font-bold text-white rounded-xl w-fit p-6 px-12 m-4 mx-auto hover:bg-green-600 shadow-xl" disabled={questions.length === 0}>
              Create Quiz
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
