import React, { useState } from 'react';
import { Player, GamePhase } from '../types'; // Added GamePhase import

interface GameControlsProps {
  currentPlayer: Player | null;
  onSpin: (spinResult: number) => void;
  spinResult: number | null;
  isSpinDisabled: boolean;
  gamePhase: GamePhase; 
  gameSpeedMultiplier: number; // Added gameSpeedMultiplier prop
}

const GameControls: React.FC<GameControlsProps> = ({ currentPlayer, onSpin, spinResult, isSpinDisabled, gamePhase, gameSpeedMultiplier }) => { 
  const [isSpinning, setIsSpinning] = useState(false);

  const actualIsSpinDisabled = 
    isSpinDisabled || 
    isSpinning || 
    !currentPlayer || 
    currentPlayer.isRetired || 
    currentPlayer.missNextTurn ||
    currentPlayer.isCPU ||
    !!currentPlayer.isDelegatedThisTurn;

  const handleSpinClick = () => {
    if (actualIsSpinDisabled) return;

    setIsSpinning(true);
    // Simulate spinning animation
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1; // 1 to 6
      onSpin(result);
      setIsSpinning(false);
    }, 700 * gameSpeedMultiplier); // Applied gameSpeedMultiplier
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl text-center space-y-4">
      <h2 className="text-2xl font-poppins font-bold text-indigo-700">게임 컨트롤</h2>
      {currentPlayer && !currentPlayer.isRetired ? (
        <>
          <p className="text-lg">
            <span className={`${currentPlayer.colorSet.text} font-semibold`}>{currentPlayer.name}</span>님의 턴
          </p>
          {currentPlayer.missNextTurn ? (
             <p className="text-orange-600 font-semibold text-lg">이번 턴은 쉽니다!</p>
          ) : currentPlayer.isCPU || currentPlayer.isDelegatedThisTurn ? ( 
            <p className="text-blue-600 font-semibold text-lg">
              {currentPlayer.isCPU ? 'CPU가' : `${currentPlayer.name}님이 위임하여 CPU가`} 자동으로 진행 중입니다...
            </p>
          ) : (
            <button
            onClick={handleSpinClick}
            disabled={actualIsSpinDisabled}
            className={`w-full px-6 py-3 text-xl font-semibold text-white rounded-lg shadow-md transition-colors duration-150 ease-in-out
                        ${actualIsSpinDisabled ? 'bg-gray-400 cursor-not-allowed' : `${currentPlayer.colorSet.token.replace('bg-','bg-')} hover:${currentPlayer.colorSet.token.replace('bg-','bg-').slice(0,-3)}600 focus:ring-2 focus:ring-offset-2 ${currentPlayer.colorSet.token.replace('bg-','ring-')}`} `}
            aria-label={isSpinning ? "주사위 돌리는 중" : "주사위 굴리기, 1부터 6까지"}
          >
            {isSpinning ? '돌리는 중...' : '주사위 (1-6)'}
          </button>
          )}
          
          {spinResult !== null && !(currentPlayer.isCPU || currentPlayer.isDelegatedThisTurn) && ( 
            <p className="mt-4 text-2xl font-bold text-gray-700">
              결과: <span className="text-pink-500">{spinResult}</span>
            </p>
          )}
           {spinResult !== null && (currentPlayer.isCPU || currentPlayer.isDelegatedThisTurn) && gamePhase !== GamePhase.EVENT_RESOLUTION && (
             <p className="mt-4 text-xl font-semibold text-gray-600">
                (CPU 굴림: <span className="text-blue-500">{spinResult}</span>)
             </p>
           )}
        </>
      ) : currentPlayer?.isRetired ? (
        <p className="text-lg text-gray-600">{currentPlayer.name}님이 은퇴했습니다.</p>
      ) : (
        <p className="text-lg text-gray-500">게임 시작 대기 중...</p>
      )}
    </div>
  );
};

export default GameControls;