
import React from 'react';
import { Player } from '../types';

interface PlayerTokenProps {
  player: Player;
  offset: number; // Used to slightly offset tokens if multiple are on the same space
  size?: number; // size in pixels
}

const PlayerToken: React.FC<PlayerTokenProps> = ({ player, offset, size = 8 }) => {
  const baseOffset = size / 2; // Base offset to center
  const xOffset = baseOffset + (offset % 2 === 0 ? offset * (size * 0.6) : (offset-1) * (size*0.6) + size*0.3); 
  const yOffset = baseOffset + (offset >= 2 ? size * 0.6 : 0);

  return (
    <div
      title={player.name}
      className={`absolute rounded-full border-2 border-white shadow-md transition-all duration-300 ease-in-out`}
      style={{
        backgroundColor: player.colorSet.token.startsWith('bg-') ? player.colorSet.token.replace('bg-', '').split('-')[0] : 'gray', // Simplified color extraction
        width: `${size * 2.5}px`,
        height: `${size * 2.5}px`,
        left: `${xOffset}px`,
        top: `${yOffset}px`,
        transform: `translate(-50%, -50%)`, // Center the token better
        zIndex: 10 + offset,
      }}
    >
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
        {player.name.substring(0,1).toUpperCase()}
      </span>
    </div>
  );
};

export default PlayerToken;
    