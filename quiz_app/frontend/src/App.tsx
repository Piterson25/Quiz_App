import * as React from "react";
import { Route, Routes } from 'react-router-dom';

import { Provider } from "react-redux";
import { getQuizzes } from './api';
import { QuizzesContext } from './components/Context';
import { RefreshContext } from './components/ContextRefresh';
import { CreateQuiz } from './components/CreateQuiz';
import { EditQuiz } from './components/EditQuiz';
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { PlayQuiz } from './components/PlayQuiz';
import { Quiz } from './components/Quiz';
import { QuizList } from './components/QuizList';
import './index.css';
import { Quiz as QuizType } from './models';
import store from "./store";

const App: React.FC = () => {
  const [quizzes, setQuizzes] = React.useState<QuizType[]>([]);
  const [refresh, setRefresh] = React.useState<boolean>(false);

  React.useLayoutEffect(() => {
    getQuizzes().then((quizzes) => setQuizzes(quizzes));
  }, [refresh]);
  

  return (
    <Provider store={store}>
      <RefreshContext.Provider value={{ refresh, setRefresh }}>
        <QuizzesContext.Provider value={quizzes}>
          <div className="min-h-screen bg-gray-300">
            <Navbar />
            <div className="pt-24">
              <Routes>
                <Route path="/" element={<QuizList />}></Route>
                <Route path="/quiz/create" element={<CreateQuiz />}></Route>
                <Route path="/quiz/:id" element={<Quiz />}></Route>
                <Route path="/quiz/play/:id" element={<PlayQuiz />}></Route>
                <Route path="/quiz/edit/:id" element={<EditQuiz />}></Route>
              </Routes>
            </div>
            <Footer />
          </div>
        </QuizzesContext.Provider>
      </RefreshContext.Provider>
    </Provider>
  );
};

export default App;
