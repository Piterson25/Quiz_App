import * as React from "react";
import { Quiz as QuizType } from '../models';
import { updateQuiz, getQuiz } from '../api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { RefreshContext } from './ContextRefresh';

export const EditQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = React.useState<QuizType | null>(null);
  const { refresh, setRefresh } = React.useContext(RefreshContext);

  const navigate = useNavigate();

  React.useEffect(() => {
    getQuiz(id).then(setQuiz);
  }, [id]);

  if (!quiz) {
    return <div className="min-h-screen text-3xl flex justify-center items-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen font-bold text-center text-xl">
      <Link to={`/quiz/${id}`} key={id} className="text-xl font-bold rounded-xl bg-green-500 text-white w-fit p-4 px-8 m-4 fixed left-0 top-25 hover:bg-green-600 shadow-xl">
        Return
      </Link>
      <Formik
        initialValues={{ name: quiz.name, description: quiz.description, difficulty: quiz.difficulty, negativePoints: quiz.negativePoints, timeForQuestion: quiz.timeForQuestion, randomQuestionsPlacement: quiz.randomQuestionsPlacement, randomAnswersPlacement: quiz.randomAnswersPlacement, noReturn: quiz.noReturn }}
        onSubmit={(values) => {
          updateQuiz(id, values as QuizType).then(() => {setRefresh(!refresh)});
          navigate(`/quiz/${id}`);
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="h-full p-4 mx-auto flex flex-col justify-center w-fit">
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

            <button type="submit" className="text-2xl block bg-indigo-500 text-white rounded-xl w-fit p-6 px-12 m-4 mx-auto hover:bg-indigo-600 shadow-xl">Save</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
