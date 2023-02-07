import * as React from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Quiz as QuizType } from '../models';
import { deleteQuiz, getQuiz } from '../api';
import { RefreshContext } from './ContextRefresh';

export const Quiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = React.useState<QuizType | null>(null);
  const { refresh, setRefresh } = React.useContext(RefreshContext);

  const navigate = useNavigate();

  React.useEffect(() => {
    getQuiz(id).then((quiz) => setQuiz(quiz)).then(() => setRefresh(!refresh));
  }, []);

  if (!quiz) {
    return <div className="min-h-screen text-3xl flex justify-center items-center text-gray-500">Loading...</div>;
  }

  const handleDelete = () => {
    deleteQuiz(id).then(() => setRefresh(!refresh));
    navigate('/');
  };

  return (
    <div className="min-h-screen font-bold text-center text-xl">
      <div>
        <Link to="/" className="text-xl font-bold rounded-xl bg-green-500 text-white w-fit p-4 px-8 mx-4 fixed left-0 top-25 hover:bg-green-600 shadow-xl">
          Return
        </Link>
        <div className="fixed right-0">
          <Link to={`/quiz/edit/${id}`} key={id} className="text-xl font-bold rounded-xl bg-indigo-500 text-white w-fit p-4 px-8 mx-4 hover:bg-indigo-600 shadow-xl">
            Edit
          </Link>
          <button className="text-xl font-bold rounded-xl bg-red-500 text-white w-fit p-4 px-8 mx-4 hover:bg-red-600 shadow-xl" onClick={handleDelete}>Delete</button>
        </div>

      </div>
      <div className="bg-white h-full w-96 min-h-48 rounded-xl shadow-xl p-4 m-8 mx-auto flex flex-col justify-center w-fit text-gray-500">
        <h2 className="text-4xl break-words">{quiz.name}</h2>
        <div className={
          quiz.difficulty === 'easy' ? 'text-2xl text-green-500' :
            quiz.difficulty === 'medium' ? 'text-2xl text-yellow-500' :
              quiz.difficulty === 'hard' ? 'text-2xl text-red-500' :
                null
        }>{quiz.difficulty}</div>
        <p className="break-words">{quiz.description}</p>
        <h3 className="text-xl">Questions: {quiz.questions.length}</h3>
      </div>
      <Link to={`/quiz/play/${id}`} className="text-xl font-bold rounded-xl bg-green-500 text-white w-fit p-4 px-8 hover:bg-green-600 shadow-xl justify-center">
        Play
      </Link>
      <table className="table-auto mx-auto mt-16">
        <thead>
          <tr>
            <th className="px-4 py-2">Player</th>
            <th className="px-4 py-2">Score</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {quiz.ranking.sort((a, b) => b.score - a.score).map((ranking, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{ranking.playerName}</td>
              <td className="border px-4 py-2">{ranking.score}</td>
              <td className="border px-4 py-2">{ranking.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
