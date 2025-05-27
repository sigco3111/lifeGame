
import React, { useState, useEffect } from 'react';
import { ActiveModalEvent, LifeEventOption, Player } from '../types';

interface EventModalProps {
  event: ActiveModalEvent | null;
  currentPlayer: Player; // The player for whom this event is occurring
  allPlayers: Player[];
  onResolveOption: (option: LifeEventOption) => void;
  onClose: (message?: string) // Optional message to pass if event had a direct effect
}

const EventModal: React.FC<EventModalProps> = ({ event, currentPlayer, allPlayers, onResolveOption, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (event) {
      setIsProcessing(false);
    }
  }, [event]);

  if (!event) return null;

  const { data, messageLog = [] } = event;

  const handleOptionClick = (option: LifeEventOption) => {
    if (currentPlayer.isCPU || currentPlayer.isDelegatedThisTurn) return; 
    setIsProcessing(true);
    onResolveOption(option);
  };

  const handleEffectClose = () => {
    if (currentPlayer.isCPU || currentPlayer.isDelegatedThisTurn) return; 
    setIsProcessing(true);
    if (data.effect) {
      const result = data.effect(currentPlayer, allPlayers);
      onClose(result.message); 
    } else {
      onClose(); 
    }
  };

  const buttonsDisabled = isProcessing || currentPlayer.isCPU || !!currentPlayer.isDelegatedThisTurn;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
        <h2 className={`text-2xl md:text-3xl font-poppins font-bold mb-4 ${currentPlayer.colorSet.text}`}>{data.title}</h2>
        <p className="text-gray-700 mb-6 text-base md:text-lg">{data.description}</p>

        {messageLog.length > 0 && (
          <div className="mb-4 p-3 bg-sky-100 rounded-md border border-sky-300">
            {messageLog.map((msg, idx) => (
              <p key={idx} className="text-sm text-sky-700">{msg}</p>
            ))}
          </div>
        )}

        {data.options && data.options.length > 0 ? (
          <div className="space-y-3">
            {data.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                disabled={buttonsDisabled}
                className={`w-full px-4 py-3 text-left font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out
                            ${currentPlayer.colorSet.token.replace('bg-','bg-')} text-white 
                            hover:${!buttonsDisabled ? currentPlayer.colorSet.token.replace('bg-','bg-').slice(0,-3) + '700' : ''}
                            focus:ring-2 focus:ring-offset-1 ${currentPlayer.colorSet.token.replace('bg-','ring-')}
                            ${buttonsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {option.text}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={handleEffectClose}
            disabled={buttonsDisabled}
            className={`w-full px-4 py-3 font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out
                        ${currentPlayer.colorSet.token.replace('bg-','bg-')} text-white 
                        hover:${!buttonsDisabled ? currentPlayer.colorSet.token.replace('bg-','bg-').slice(0,-3) + '700' : ''}
                        focus:ring-2 focus:ring-offset-1 ${currentPlayer.colorSet.token.replace('bg-','ring-')}
                        ${buttonsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? '처리 중...' : ((currentPlayer.isCPU || !!currentPlayer.isDelegatedThisTurn) && !isProcessing ? `CPU${currentPlayer.isDelegatedThisTurn ? '(위임)' : ''} 결정 중...` : '확인')}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventModal;