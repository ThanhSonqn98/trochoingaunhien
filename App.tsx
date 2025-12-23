
import React, { useState } from 'react';
import { analyzeAndGenerateGame } from './services/geminiService';
import { GameType, GameConfig, AppSettings } from './types';
import RungChuongVang from './games/RungChuongVang';
import MemoryGame from './games/MemoryGame';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'input' | 'loading' | 'playing'>('input');
  const [rawData, setRawData] = useState('');
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    students: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E'],
    timer: 15,
  });

  const handleStartGame = async () => {
    if (!rawData.trim()) return;

    setGameState('loading');
    try {
      const config = await analyzeAndGenerateGame(rawData);
      setGameConfig(config);
      setGameState('playing');
    } catch (error: any) {
      console.error(error);
      alert("Đã xảy ra lỗi khi tạo trò chơi. Vui lòng kiểm tra lại dữ liệu nhập vào.");
      setGameState('input');
    }
  };

  const renderGame = () => {
    if (!gameConfig) return null;

    switch (gameConfig.type) {
      case GameType.RUNG_CHUONG_VANG:
        return <RungChuongVang config={gameConfig} settings={settings} onExit={() => setGameState('input')} />;
      case GameType.MEMORY:
        return <MemoryGame config={gameConfig} settings={settings} onExit={() => setGameState('input')} />;
      default:
        return <RungChuongVang config={gameConfig} settings={settings} onExit={() => setGameState('input')} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-sky-50 flex flex-col items-center justify-center">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-[10%] w-32 h-32 bg-yellow-200 rounded-full opacity-30 blur-xl float"></div>
        <div className="absolute bottom-20 right-[15%] w-48 h-48 bg-pink-200 rounded-full opacity-30 blur-2xl float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] right-[5%] w-24 h-24 bg-cyan-200 rounded-full opacity-40 blur-lg float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[10%] left-[5%] w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center p-4">
        {gameState === 'input' && (
          <div className="w-full max-w-3xl bg-white p-10 rounded-[2.5rem] shadow-2xl border-b-[12px] border-yellow-400 bounce-in">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center text-4xl shadow-lg transform -rotate-6">
                🎓
              </div>
            </div>
            <h1 className="text-5xl font-black text-center text-blue-600 mb-4 drop-shadow-sm tracking-tight">
               GAME MASTER TIỂU HỌC
            </h1>
            <p className="text-gray-500 text-center mb-10 text-xl font-medium leading-relaxed px-10">
              Nhập bài học, câu hỏi hoặc từ vựng.<br/>
              AI sẽ tạo ngay một thế giới trò chơi kỳ diệu cho các bé!
            </p>
            
            <div className="space-y-4">
              <label className="block text-blue-800 font-black text-lg ml-2 mb-1">DỮ LIỆU CỦA TÔI:</label>
              <textarea
                className="w-full h-56 p-6 border-4 border-blue-100 rounded-[2rem] focus:border-blue-400 outline-none transition-all text-xl placeholder:text-gray-300 shadow-inner bg-gray-50/50"
                placeholder="Ví dụ: 
1. Ai là người đầu tiên đặt chân lên mặt trăng?
2. Con vật nào gáy báo thức vào buổi sáng?
..."
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
              />
            </div>
            
            <button
              onClick={handleStartGame}
              className="w-full mt-10 bg-orange-500 hover:bg-orange-600 text-white font-black py-6 rounded-[2rem] text-3xl shadow-[0_10px_0_rgb(194,65,12)] transform hover:scale-[1.02] transition-all active:scale-95 active:shadow-none active:translate-y-2 flex items-center justify-center gap-4"
            >
              <i className="fas fa-rocket animate-bounce"></i> BẮT ĐẦU PHÉP THUẬT!
            </button>
          </div>
        )}

        {gameState === 'loading' && (
          <div className="text-center bounce-in flex flex-col items-center">
             <div className="relative">
                <div className="w-32 h-32 border-b-8 border-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">✨</div>
             </div>
            <h2 className="text-4xl font-black text-blue-600 mt-8 mb-3">Phép thuật đang diễn ra...</h2>
            <p className="text-2xl text-orange-500 font-bold italic animate-pulse">AI đang thiết kế màn chơi tuyệt nhất!</p>
          </div>
        )}

        {gameState === 'playing' && renderGame()}
      </div>

      {/* Global Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-6 right-6 bg-white p-4 rounded-3xl shadow-xl border-4 border-yellow-400 text-3xl text-yellow-600 hover:rotate-90 transition-all z-50 hover:scale-110 active:scale-90"
        title="Cài đặt lớp học"
      >
        <i className="fas fa-cog"></i>
      </button>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={(newSettings) => {
            setSettings(newSettings);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default App;
