import * as React from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Quiz as QuizType, Question } from '../models';
import { getQuiz, createRanking } from '../api';
import { v4 } from 'uuid'
import { RefreshContext } from './ContextRefresh';

export const PlayQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = React.useState<QuizType | null>(null);
  const [currentQuestion, setCurrentQuestion] = React.useState<Question | null>({
    _id: '',
    type: 'single',
    question: '',
    correctAnswer: [],
    answers: []
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);
  const [score, setScore] = React.useState<number>(0);
  const [playerName, setPlayerName] = React.useState<string>('');
  const playerNameInput = React.useRef<HTMLInputElement>(null);
  const { refresh, setRefresh } = React.useContext(RefreshContext);
  const [ myAnswers, setMyAnswers ] = React.useState<string[]>([]);
  const [ approved, setApproved] = React.useState<boolean>(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    getQuiz(id).then((quiz) => {
      if (quiz.randomAnswersPlacement) {
        quiz.questions.forEach((question: Question) => {
          question.answers.sort(() => Math.random() - 0.5)
        });
      }
      if (quiz.randomQuestionsPlacement) {
        quiz?.questions.sort(() => Math.random() - 0.5);
      }
      setCurrentQuestion(quiz.questions[currentQuestionIndex]);
      setQuiz(quiz);
    });
  }, []);


  if (!quiz) {
    return <div className="min-h-screen text-3xl flex justify-center items-center text-gray-500">Loading...</div>;
  }

  const handleNextQuestion = (index: number) => {
    if (index >= 0 && index < quiz?.questions.length) {
      setCurrentQuestion(quiz?.questions[index]);
      setCurrentQuestionIndex(index);
      setMyAnswers([]);
      setApproved(false);
      const elements = document.getElementsByTagName("input");
      for (let i = 0; i < elements.length; i++) {
              if (elements[i].type === "radio") {
                  elements[i].checked = false;
              }
              else if (elements[i].type === "text") {
                elements[i].value = '';
              }
          }
    }
    else if (index >= quiz?.questions.length) {
      setCurrentQuestionIndex(index);
    }
  }

  const handleAnswerSelect = (answer: string) => {
    if (currentQuestion.type !== 'single' && currentQuestion.type !== 'multiple') {
      setMyAnswers([answer]);
    }
    else {
      if (!myAnswers.includes(answer)) {
        const newAnswers = [...myAnswers, answer];
        setMyAnswers(newAnswers)
      }
      else {
        const newAnswers = myAnswers.filter((my) => my !== answer);
        setMyAnswers(newAnswers);
      }
    }
    
  }

  const handleApprove = () => {
    if ((currentQuestion.type === 'short' || currentQuestion.type === 'fillblank') && myAnswers[0].toLowerCase() === currentQuestion.correctAnswer[0].toLowerCase()) {
      setScore(score + 1);
    }
    else if (myAnswers.length === currentQuestion.correctAnswer.length) {
      const founded = myAnswers.some(a=> currentQuestion.correctAnswer.includes(a))
      if (founded) {
        setScore(score + 1);
      }
      else if (!founded && quiz.negativePoints && score > 0) {
        setScore(score - 1);
      }
    }
    else if (quiz.negativePoints && score > 0) {
      setScore(score - 1);
    }
    
    setApproved(true);
  }

  const handleFinish = () => {
    const newRanking = {
      _id: v4(),
      quizId: id,
      playerName: playerName,
      score: score,
      date: new Date().toLocaleDateString("pl-PL"),
    };
    createRanking(id, newRanking).then(() => setRefresh(!refresh));
    navigate(`/quiz/${id}`);
  };

  return (
    <div className="min-h-screen font-bold text-center text-xl">
      <div>
        <Link to={`/quiz/${quiz._id}`} key={quiz._id} className="text-xl font-bold rounded-xl bg-green-500 text-white w-fit p-4 px-8 mx-4 fixed left-0 top-25 hover:bg-green-600 shadow-xl">
          Return
        </Link>
      </div>
      {playerName ?
        <div className="break-words bg-white h-full min-w-96 min-h-48 rounded-xl shadow-xl p-4 m-4 mx-auto flex flex-col justify-center w-fit text-gray-500">
          {currentQuestionIndex === quiz?.questions.length ?
            <div>
              <p>Your score is {score} out of {quiz?.questions.length}</p>
              <button className="bg-green-500 text-white p-4 w-fit hover:bg-green-600 rounded-xl shadow-xl" onClick={handleFinish}>Finish</button>
            </div>
            :
            <div>
              <h2>{currentQuestion.question}</h2>

              {currentQuestion.type === 'truefalse' ? (
                <div className="flex flex-col">
                  <label>
                    <input type="radio" name="truefalse" value="true" onChange={() => {
                      handleAnswerSelect("true");
                    }} disabled={approved} />
                    True
                    {approved ?
                      currentQuestion.correctAnswer[0] === "true" ?
                        <p className="text-green-500">Correct</p>
                        :
                        <p className="text-red-500">Incorrect</p>
                    :
                    null}
                  </label>
                  <label>
                    <input type="radio" name="truefalse" value="false" onChange={() => {
                      handleAnswerSelect("false");
                    }}  disabled={approved} />
                    False
                    {approved ?
                      currentQuestion.correctAnswer[0] === "false" ?
                        <p className="text-green-500">Correct</p>
                        :
                        <p className="text-red-500">Incorrect</p>
                    :
                    null}
                  </label>
                </div>
              ) : currentQuestion.type === 'dropdown' ? (
                <div>
                <select className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' name="select" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  handleAnswerSelect(e.target.value)
                  }} disabled={approved}>
                    <option value="">Wybierz z listy</option>
                  {currentQuestion.answers.map(option => (
                    <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                {approved ?
                  currentQuestion.correctAnswer.includes(myAnswers[0]) ?
                    <p className="text-green-500">Correct</p>
                    :
                    <p className="text-red-500">Incorrect</p>
                :
                null}
                </div>
              )
              : currentQuestion.type === 'short' || currentQuestion.type === 'fillblank' ? (
                <div>
                <input className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' type='text' name='short' onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleAnswerSelect(e.target.value)}}></input>
                  {approved ?
                    currentQuestion.correctAnswer[0].toLowerCase().includes(myAnswers[0].toLowerCase()) ?
                      <p className="text-green-500">Correct</p>
                      :
                      <p className="text-red-500">Incorrect</p>
                  :
                  null}
                  </div>
              ) 
                : currentQuestion.type === 'single' || currentQuestion.type === 'multiple' ? 
              (<div>
                <ul className="flex flex-row justify-between w-full mt-8 p-8">
                  {currentQuestion.answers.map((answer: string, index: number) => (
                    <li key={index}>
                      <button className={`bg-slate-200 m-4 p-4 w-fit hover:bg-slate-300 rounded-xl shadow-xl ${myAnswers.includes(answer) ? 'bg-cyan-500 hover:bg-cyan-600 text-white' : ''}`}
                        onClick={() => handleAnswerSelect(answer)}
                        disabled={approved}>
                        {answer}
                      </button>
                      {approved ?
                        currentQuestion.correctAnswer.includes(answer) ?
                          <p className="text-green-500">Correct</p>
                          :
                          <p className="text-red-500">Incorrect</p>
                      :
                      null}
                    </li>

                  ))}
                </ul>
              </div>
              ) : null }

              {!approved ? 
                <button className="bg-green-500 text-white p-4 w-fit hover:bg-green-600 rounded-xl shadow-xl" onClick={() => {
                  handleApprove();
                }}>Submit</button>
                :
                <button className="bg-green-500 text-white p-4 w-fit hover:bg-green-600 rounded-xl shadow-xl" onClick={() => {
                  handleNextQuestion(currentQuestionIndex + 1);
                }}>Next</button>
              }
            </div>
          }
        </div>
        :
        <form className="h-full flex flex-col justify-center items-center align-center" onSubmit={(e) => {
          e.preventDefault();
          if (playerNameInput && playerNameInput.current) {
            setPlayerName(playerNameInput.current.value);
          }
        }}>
          <label>Enter player name:</label>
          <input className='p-4 hover:bg-gray-100 rounded-xl m-4 shadow-xl' ref={playerNameInput} name="name" type="text" id="playerName" placeholder="Enter name" required />
          <button type="submit" className="text-xl font-bold rounded-xl bg-green-500 text-white w-fit p-4 px-8 mx-4 hover:bg-green-600 shadow-xl">
            Play
          </button>
        </form>}

    </div>
  );
};
