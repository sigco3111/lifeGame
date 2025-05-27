
import React, { useState } from 'react';
import { Player } from '../types';
import { INITIAL_MONEY, MAX_PLAYERS, MIN_PLAYERS, PLAYER_COLORS } from '../constants';

interface PlayerConfig {
  name: string;
  isCPU: boolean;
}

interface PlayerSetupProps {
  onStartGame: (players: Player[]) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStartGame }) => {
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(
    Array(MIN_PLAYERS).fill(null).map((_, index) => ({ name: '', isCPU: index > 0 }))
  );
  const [numPlayers, setNumPlayers] = useState<number>(MIN_PLAYERS);

  const handleNumPlayersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value, 10);
    setNumPlayers(count);
    setPlayerConfigs(currentConfigs => {
      const newConfigs = Array(count).fill(null).map((_, i) => {
        if (i < currentConfigs.length) {
          return currentConfigs[i]; // Preserve existing player config including name and isCPU
        }
        // For new player slots being added, default to CPU if not the first player
        return { name: '', isCPU: i > 0 }; 
      });
      // If count < currentConfigs.length, newConfigs will be shorter.
      // If count > currentConfigs.length, newConfigs will be longer, adding new players.
      return newConfigs;
    });
  };

  const handleNameChange = (index: number, name: string) => {
    const newConfigs = [...playerConfigs];
    newConfigs[index] = { ...newConfigs[index], name };
    setPlayerConfigs(newConfigs);
  };

  const handleIsCPUChange = (index: number, isCPU: boolean) => {
    const newConfigs = [...playerConfigs];
    newConfigs[index] = { ...newConfigs[index], isCPU };
    setPlayerConfigs(newConfigs);
  };

  const handleAddPlayer = () => {
    if (numPlayers < MAX_PLAYERS) {
      // handleNumPlayersChange will correctly set default isCPU for the new player
      handleNumPlayersChange({ target: { value: (numPlayers + 1).toString() } } as any);
    }
  };
  
  const handleRemovePlayer = () => {
    if (numPlayers > MIN_PLAYERS) {
       // handleNumPlayersChange will correctly shorten the array
       handleNumPlayersChange({ target: { value: (numPlayers - 1).toString() } } as any);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlayers: Player[] = playerConfigs.map((config, index) => ({
      id: `player-${index + 1}-${Date.now()}`,
      name: config.name.trim() || `플레이어 ${index + 1}${config.isCPU ? ' (CPU)' : ''}`,
      colorSet: PLAYER_COLORS[index % PLAYER_COLORS.length],
      money: INITIAL_MONEY,
      position: 0,
      isRetired: false,
      missNextTurn: false,
      isCPU: config.isCPU,
    }));
    onStartGame(newPlayers);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 to-indigo-600 p-6">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-poppins font-bold text-center text-indigo-700 mb-8">인생 게임 설정</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="numPlayers" className="block text-sm font-medium text-gray-700 mb-1">플레이어 수:</label>
            <div className="flex items-center space-x-2">
              <select
                id="numPlayers"
                value={numPlayers}
                onChange={handleNumPlayersChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {Array.from({ length: MAX_PLAYERS - MIN_PLAYERS + 1 }, (_, i) => MIN_PLAYERS + i).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <button type="button" onClick={handleAddPlayer} disabled={numPlayers >= MAX_PLAYERS} className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-gray-300">+</button>
              <button type="button" onClick={handleRemovePlayer} disabled={numPlayers <= MIN_PLAYERS} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300">-</button>
            </div>
          </div>

          {playerConfigs.map((config, index) => (
            <div key={index} className="p-3 border rounded-md border-gray-200">
              <label htmlFor={`player-${index}`} className={`block text-sm font-medium ${PLAYER_COLORS[index % PLAYER_COLORS.length].text}`}>
                플레이어 {index + 1} ({PLAYER_COLORS[index % PLAYER_COLORS.length].name}):
              </label>
              <input
                type="text"
                id={`player-${index}`}
                value={config.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`플레이어 ${index + 1} 이름 입력`}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${PLAYER_COLORS[index % PLAYER_COLORS.length].border} focus:ring-2`}
              />
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id={`cpu-${index}`}
                  checked={config.isCPU}
                  onChange={(e) => handleIsCPUChange(index, e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor={`cpu-${index}`} className="ml-2 block text-sm text-gray-700">
                  CPU 플레이어 (자동)
                </label>
              </div>
            </div>
          ))}
          
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 transition duration-150 ease-in-out"
          >
            게임 시작!
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerSetup;
