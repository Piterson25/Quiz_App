import * as React from "react";
import { QuizzesContext } from "./Context";
import { Link } from 'react-router-dom';
import "../styles/index.scss"

export const QuizList: React.FC = () => {

  const quizzes = React.useContext(QuizzesContext);

  if (!quizzes) {
    return <div className="min-h-screen text-3xl flex justify-center items-center text-gray-500">Loading...</div>;
  }

  return (
    <div >
      <Link to={`quiz/create`} className="text-2xl block bg-green-500 font-bold text-white rounded-xl w-fit p-6 px-12 m-4 mx-auto hover:bg-green-600 shadow-xl">Create quiz</Link>
      {quizzes.length === 0 ?
        <div className="min-h-screen text-4xl flex justify-center items-center text-gray-500">Create new quizzes</div> :
        <div id="quiz-list" className="font-bold h-full text-center min-h-screen grid grid-cols-3 list-none text-gray-500">
          {quizzes.map(quiz => (
            <Link to={`/quiz/${quiz._id}`} key={quiz._id} className="bg-white hover:bg-slate-200 w-96 h-48 rounded-xl mx-auto my-24 shadow-xl flex flex-col items-center justify-center">
              <h2 className="text-4xl break-all">{quiz.name}</h2>
              <div className={
                quiz.difficulty === 'easy' ? 'text-2xl text-green-500' :
                  quiz.difficulty === 'medium' ? 'text-2xl text-yellow-500' :
                    quiz.difficulty === 'hard' ? 'text-2xl text-red-500' :
                      null
              }>{quiz.difficulty}</div>
              <h3 className="text-xl">Questions: {quiz.questions.length}</h3>
            </Link>
          ))}
        </div>
      }
    </div>
  );
};
