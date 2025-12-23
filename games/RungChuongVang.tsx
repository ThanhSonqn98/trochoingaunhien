
import React, { useState, useEffect, useCallback } from 'react';
import { GameConfig, AppSettings, Question } from '../types';

interface Props {
  config: GameConfig;
  settings: AppSettings;
  onExit: () => void;
}

const RungChuongVang: React.FC<Props> = ({ config, settings, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [timeLeft, setTimeLeft] = useState(settings.timer);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showExplainer, setShowExplainer] = useState(false);
  const [finished, setFinished] = useState(false);

  const questions: Question[] = config.items;
  const currentQuestion = questions[currentQuestionIndex];

  const pickStudent = useCallback(() => {
    if (settings.students.length === 0) return;
    const randomIdx = Math.floor(Math.random() * settings.students.length);
    setSelectedStudent(settings.students[randomIdx]);
  }, [settings.students]);

  useEffect(() => {
    pickStudent();
  }, [pickStudent]);

  useEffect(() => {
    let timer: any;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setShowAnswer(true);
      setIsTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);

  const handleStartTimer = () => {
    setIsTimerActive(true);
    setShowAnswer(false);
    setUserAnswer(null);
    setShowExplainer(false);
    setTimeLeft(settings.timer);
  };

  const handleSelectOption = (option: string) => {
    if (showAnswer) return;
    setUserAnswer(option);
    setShowAnswer(true);
    setIsTimerActive(false);

    if (option === currentQuestion.answer) {
      setScore(prev => prev + 1);
      setShowExplainer(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(settings.timer);
      setIsTimerActive(false);
      setShowAnswer(false);
      setUserAnswer(null);
      setShowExplainer(false);
      pickStudent();
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="w-full max-w-2xl bg-white p-12 rounded-3xl shadow-2xl border-4 border-yellow-400 text-center bounce-in">
        <h2 className="text-6xl font-black text-blue-600 mb-6 drop-shadow-lg">🎉 TUYỆT VỜI!</h2>
        <div className="bg-blue-50 p-8 rounded-2xl mb-8">
          <p className="text-2xl text-blue-800 font-bold mb-2">Điểm số của lớp chúng mình</p>
          <div className="text-7xl font-black text-orange-500">{score} <span className="text-3xl text-gray-400">/ {questions.length}</span></div>
        </div>
        <button
          onClick={onExit}
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-bold py-5 px-16 rounded-2xl text-3xl shadow-lg transform hover:scale-105 transition-all active:scale-95"
        >
          <i className="fas fa-home mr-2"></i> Trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl h-full flex flex-col gap-6 animate-fadeIn pb-10">
      {/* Top Bar */}
      <div className="grid grid-cols-3 items-center bg-white/95 p-6 rounded-3xl border-b-8 border-yellow-400 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col pl-4">
          <span className="text-blue-500 font-bold uppercase text-xs tracking-widest mb-1">Đang gọi tên</span>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-blue-800 truncate max-w-[200px]">{selectedStudent || '...'}</span>
            <button 
              onClick={pickStudent} 
              title="Đổi học sinh khác"
              className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-all active:rotate-180"
            >
              <i className="fas fa-random"></i>
            </button>
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-6">
          <div className={`relative w-24 h-24 rounded-full flex items-center justify-center border-8 shadow-inner transition-all shrink-0 ${timeLeft < 5 ? 'border-red-500 text-red-600 bg-red-50 animate-pulse' : 'border-cyan-400 text-blue-600 bg-white'}`}>
            <span className="text-4xl font-black">{timeLeft}</span>
            <div className="absolute -bottom-2 bg-yellow-400 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Giây</div>
          </div>
          
          {!isTimerActive && !showAnswer && (
            <button
              onClick={handleStartTimer}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-[1.5rem] text-xl font-black shadow-lg transform hover:scale-105 transition-all flex items-center gap-3 whitespace-nowrap bounce-in"
            >
              <i className="fas fa-play text-sm"></i> BẮT ĐẦU NGAY
            </button>
          )}
        </div>

        <div className="text-right pr-4">
          <span className="text-blue-500 font-bold uppercase text-xs tracking-widest mb-1">Tiến trình</span>
          <div className="text-3xl font-black text-blue-800">{currentQuestionIndex + 1} <span className="text-lg text-gray-400">/ {questions.length}</span></div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-t-[12px] border-cyan-400 flex-grow flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><i className="fas fa-graduation-cap text-9xl"></i></div>
        
        <h3 className="text-4xl font-bold text-center text-gray-800 mb-12 leading-snug px-4">
          {currentQuestion.text}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {currentQuestion.options?.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isCorrect = opt === currentQuestion.answer;
            const isUserPick = opt === userAnswer;
            
            let btnClass = "group relative bg-white border-4 border-blue-100 p-8 rounded-3xl flex items-center gap-6 transition-all hover:scale-[1.03] active:scale-95 shadow-lg overflow-hidden";
            let letterClass = "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0 transition-colors shadow-md ";

            if (showAnswer) {
              if (isCorrect) {
                btnClass = "relative bg-green-50 border-4 border-green-500 p-8 rounded-3xl flex items-center gap-6 shadow-xl scale-[1.02] z-10";
                letterClass += "bg-green-500 text-white";
              } else if (isUserPick) {
                btnClass = "relative bg-red-50 border-4 border-red-500 p-8 rounded-3xl flex items-center gap-6 shadow-md opacity-80";
                letterClass += "bg-red-500 text-white";
              } else {
                btnClass = "relative bg-gray-50 border-4 border-gray-100 p-8 rounded-3xl flex items-center gap-6 shadow-sm opacity-40 grayscale-[0.5]";
                letterClass += "bg-gray-400 text-white";
              }
            } else {
              letterClass += "bg-blue-500 text-white group-hover:bg-blue-600";
            }

            return (
              <button
                key={idx}
                disabled={showAnswer}
                onClick={() => handleSelectOption(opt)}
                className={btnClass}
              >
                <div className={letterClass}>{letter}</div>
                <span className="text-2xl font-bold text-gray-700 text-left">{opt}</span>
                {showAnswer && isCorrect && <div className="ml-auto text-green-500 text-4xl animate-bounce"><i className="fas fa-check-circle"></i></div>}
                {showAnswer && isUserPick && !isCorrect && <div className="ml-auto text-red-500 text-4xl"><i className="fas fa-times-circle"></i></div>}
              </button>
            );
          })}
        </div>

        {showExplainer && (
          <div className="mt-10 p-6 bg-yellow-50 border-l-8 border-yellow-400 rounded-2xl w-full max-w-5xl bounce-in">
            <h4 className="font-bold text-yellow-700 text-xl mb-2 flex items-center gap-2">
              <i className="fas fa-lightbulb"></i> Giải thích cho bé:
            </h4>
            <p className="text-xl text-gray-700 leading-relaxed font-medium italic">
              {currentQuestion.explanation || "Chính xác rồi, con thật là thông minh!"}
            </p>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex gap-6 justify-center">
        {showAnswer && (
          <button
            onClick={nextQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white px-14 py-5 rounded-3xl text-2xl font-black shadow-xl transform hover:scale-110 transition-all flex items-center gap-3"
          >
            {currentQuestionIndex === questions.length - 1 ? "XEM KẾT QUẢ" : "CÂU TIẾP THEO"} <i className="fas fa-arrow-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default RungChuongVang;
