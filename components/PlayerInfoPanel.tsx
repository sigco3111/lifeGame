
import React from 'react';
import { Player, GamePhase, ActiveModalEvent } from '../types';

interface PlayerInfoPanelProps {
  players: Player[];
  currentPlayerId: string | null;
  onToggleDelegation: () => void;
  gamePhase: GamePhase;
  activeModalEvent: ActiveModalEvent | null;
  lastSpinResult: number | null;
}

const PlayerInfoPanel: React.FC<PlayerInfoPanelProps> = ({ 
  players, 
  currentPlayerId, 
  onToggleDelegation,
  gamePhase,
  activeModalEvent,
  lastSpinResult
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-xl space-y-6 h-full">
      <h2 className="text-2xl font-poppins font-bold text-center text-indigo-700 mb-4">플레이어 정보</h2>
      {players.map((player) => {
        const isCurrentPlayer = player.id === currentPlayerId;
        const canDelegate = isCurrentPlayer && 
                            !player.isCPU && 
                            !player.isRetired && 
                            !player.missNextTurn && 
                            gamePhase === GamePhase.PLAYING && 
                            !activeModalEvent && 
                            lastSpinResult === null;

        return (
          <div
            key={player.id}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              isCurrentPlayer ? `${player.colorSet.border} shadow-lg scale-105 ring-2 ${player.colorSet.border.replace('border-', 'ring-')}` : 'border-gray-200'
            } ${player.isRetired ? 'opacity-60 bg-gray-100' : 'bg-white'}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className={`text-xl font-semibold ${player.colorSet.text} font-poppins`}>{player.name}</h3>
              {isCurrentPlayer && !player.isRetired && (
                <span className="text-xs font-semibold text-white bg-pink-500 px-2 py-1 rounded-full">현재 턴</span>
              )}
               {player.isRetired && (
                <span className="text-xs font-semibold text-white bg-gray-500 px-2 py-1 rounded-full">은퇴</span>
              )}
            </div>
            <p className="text-lg text-gray-800">
              <span className="font-medium">자산:</span> ${player.money.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">위치:</span> {player.position}
              {player.missNextTurn && <span className="ml-2 text-orange-500 font-semibold">(한 턴 쉬기)</span>}
            </p>

            {canDelegate && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <label htmlFor={`delegate-${player.id}`} className="flex items-center cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={`delegate-${player.id}`}
                      className="sr-only"
                      checked={!!player.isDelegatedThisTurn}
                      onChange={onToggleDelegation}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${player.isDelegatedThisTurn ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${player.isDelegatedThisTurn ? 'translate-x-full' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-sm text-gray-700">
                    {player.isDelegatedThisTurn ? 'CPU 위임됨 (이번 턴)' : 'CPU에게 위임하기'}
                  </div>
                </label>
              </div>
            )}
          </div>
        );
      })}
       {players.length === 0 && <p className="text-gray-500 text-center">플레이어 대기 중...</p>}
    </div>
  );
};

export default PlayerInfoPanel;