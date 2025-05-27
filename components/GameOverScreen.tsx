
import React from 'react';
import { Player } from '../types';

interface GameOverScreenProps {
  players: Player[];
  onPlayAgain: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ players, onPlayAgain }) => {
  if (players.length === 0) return null;

  const sortedPlayers = [...players].sort((a, b) => b.money - a.money);
  const winner = sortedPlayers[0];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-indigo-800 flex flex-col items-center justify-center p-6 z-50 text-white">
      <div className="bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-lg text-center">
        <h1 className="text-5xl font-poppins font-bold mb-6">게임 종료!</h1>
        {winner && (
          <p className="text-3xl mb-2">
            축하합니다, <span className={`${winner.colorSet.text} font-bold bg-white px-2 rounded`}>{winner.name}</span>님!
          </p>
        )}
        <p className="text-2xl mb-8">최고의 부자입니다!</p>

        <h2 className="text-2xl font-semibold mb-4">최종 점수:</h2>
        <ul className="space-y-3 mb-8">
          {sortedPlayers.map((player, index) => (
            <li
              key={player.id}
              className={`flex justify-between items-center p-3 rounded-lg text-lg ${
                player.id === winner.id ? `${player.colorSet.token} text-white shadow-lg` : 'bg-white bg-opacity-10'
              }`}
            >
              <span className="font-semibold">
                {index + 1}. {player.name}
              </span>
              <span className={`${player.id === winner.id ? 'font-bold' : ''}`}>
                ${player.money.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
        <button
          onClick={onPlayAgain}
          className="w-full px-6 py-3 text-xl font-semibold text-indigo-700 bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-indigo-700 transition duration-150 ease-in-out"
        >
          다시 플레이
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
