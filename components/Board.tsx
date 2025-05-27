
import React from 'react';
import { BoardSpace, Player, SpaceType } from '../types';
import { SPACES_PER_ROW } from '../constants';
import PlayerToken from './PlayerToken';

interface BoardProps {
  boardSpaces: BoardSpace[];
  players: Player[];
  currentPlayerId?: string;
}

const getSpaceCoordinates = (spaceId: number, spacesPerRow: number): { row: number; col: number } => {
  const row = Math.floor(spaceId / spacesPerRow);
  let col = spaceId % spacesPerRow;
  if (row % 2 !== 0) { // Odd rows (0-indexed, so 1, 3, 5) are reversed for serpentine path
    col = spacesPerRow - 1 - col;
  }
  return { row, col };
};

const Board: React.FC<BoardProps> = ({ boardSpaces, players, currentPlayerId }) => {
  const numRows = Math.ceil(boardSpaces.length / SPACES_PER_ROW);

  return (
    <div className="p-4 bg-sky-100 rounded-lg shadow-xl">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${SPACES_PER_ROW}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${numRows}, minmax(80px, auto))`, 
        }}
      >
        {boardSpaces.map((space) => {
          const { row, col } = getSpaceCoordinates(space.id, SPACES_PER_ROW);
          const playersOnThisSpace = players.filter(p => p.position === space.id);
          const isCurrentPlayerOnSpace = playersOnThisSpace.some(p => p.id === currentPlayerId);

          return (
            <div
              key={space.id}
              className={`relative p-1.5 rounded-md shadow-md flex flex-col justify-between items-center text-center text-xs font-medium transition-all duration-200 ${space.color} ${isCurrentPlayerOnSpace ? 'ring-4 ring-offset-1 ring-pink-500' : ''}`}
              style={{
                gridRowStart: row + 1,
                gridColumnStart: col + 1,
                minHeight: '80px', // Ensure consistent cell height
              }}
            >
              <div className="font-bold text-sm">{space.id}</div>
              <div className="flex-grow flex items-center justify-center">
                <span className={space.type === SpaceType.START || space.type === SpaceType.END ? "text-sm font-semibold" : "text-xs"}>
                  {space.description}
                </span>
              </div>
              {space.type === SpaceType.PAYDAY && space.actionPayload?.amount && (
                 <div className="text-green-700 font-semibold">${space.actionPayload.amount}</div>
              )}
               {space.type === SpaceType.GET_MONEY && space.actionPayload?.amount && (
                 <div className="text-green-700 font-semibold">+${space.actionPayload.amount}</div>
              )}
              {space.type === SpaceType.LOSE_MONEY && space.actionPayload?.amount && (
                 <div className="text-red-700 font-semibold">-${Math.abs(space.actionPayload.amount)}</div>
              )}
              <div className="absolute bottom-1 right-1 w-full h-full flex items-start justify-start p-0.5"> {/* Container for tokens */}
                {playersOnThisSpace.map((player, index) => (
                  <PlayerToken key={player.id} player={player} offset={index} size={6} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;
    