
import React, { useState, useEffect } from 'react';
import { GameConfig, AppSettings, Pair } from '../types';

interface Props {
  config: GameConfig;
  settings: AppSettings;
  onExit: () => void;
}

interface Card {
  id: string;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  pairId: string;
}

const MemoryGame: React.FC<Props> = ({ config, settings, onExit }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    const pairs: Pair[] = config.items;
    const initialCards: Card[] = [];
    
    pairs.forEach((pair) => {
      // Add left side
      initialCards.push({
        id: `${pair.id}-left`,
        pairId: pair.id,
        content: pair.left,
        isFlipped: false,
        isMatched: false
      });
      // Add right side
      initialCards.push({
        id: `${pair.id}-right`,
        pairId: pair.id,
        content: pair.right,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    const shuffled = initialCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [config.items]);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedCards.length === 2) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].pairId === cards[second].pairId) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setScore(prev => prev + 10);
          
          if (matchedCards.every(c => c.isMatched)) {
            setIsWon(true);
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  if (isWon) {
    return (
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-yellow-400 text-center bounce-in max-w-xl">
        <h2 className="text-5xl font-black text-blue-600 mb-6">🎉 TUYỆT VỜI!</h2>
        <p className="text-2xl text-gray-700 mb-8">Bé đã hoàn thành với <b>{moves}</b> lượt lật!</p>
        <button
          onClick={onExit}
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-bold py-5 px-16 rounded-2xl text-3xl shadow-lg transform hover:scale-105 transition-all"
        >
          Trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl h-full flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center bg-white/90 p-6 rounded-3xl shadow-xl border-b-8 border-cyan-400">
        <h2 className="text-3xl font-black text-blue-800 uppercase tracking-tight">{config.title}</h2>
        <div className="flex gap-8">
          <div className="text-center">
            <span className="block text-blue-500 font-bold text-xs uppercase">Điểm</span>
            <span className="text-3xl font-black text-orange-500">{score}</span>
          </div>
          <div className="text-center">
            <span className="block text-blue-500 font-bold text-xs uppercase">Lượt đi</span>
            <span className="text-3xl font-black text-blue-800">{moves}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow content-center">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`
              relative h-40 cursor-pointer rounded-2xl transition-all duration-500 preserve-3d
              ${card.isFlipped || card.isMatched ? '[transform:rotateY(180deg)]' : ''}
              ${card.isMatched ? 'opacity-60 scale-95' : 'hover:scale-105'}
            `}
          >
            {/* Front of card (Hidden) */}
            <div className="absolute inset-0 backface-hidden bg-white border-4 border-blue-200 rounded-2xl flex items-center justify-center text-5xl text-blue-100">
              <i className="fas fa-question-circle"></i>
            </div>
            {/* Back of card (Content) */}
            <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-yellow-100 border-4 border-yellow-400 rounded-2xl flex items-center justify-center p-4">
              <span className="text-lg font-bold text-blue-800 text-center leading-tight">
                {card.content}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
