
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GamePhase, Player, BoardSpace, SpaceType, ActiveModalEvent, LifeEventData, LifeEventOption } from './types';
import { INITIAL_BOARD_SPACES, LIFE_EVENTS_DATA, TOTAL_SPACES } from './constants';
import PlayerSetup from './components/PlayerSetup';
import Board from './components/Board';
import PlayerInfoPanel from './components/PlayerInfoPanel';
import GameControls from './components/GameControls';
import EventModal from './components/EventModal';
import GameOverScreen from './components/GameOverScreen';

const App: React.FC = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [boardSpaces] = useState<BoardSpace[]>(INITIAL_BOARD_SPACES);
  const [activeModalEvent, setActiveModalEvent] = useState<ActiveModalEvent | null>(null);
  const [lastSpinResult, setLastSpinResult] = useState<number | null>(null);
  const [gameMessage, setGameMessage] = useState<string | null>(null);
  const [gameSpeedMultiplier, setGameSpeedMultiplier] = useState<number>(1); // 1: Normal, 0.5: 2x, 0.25: 4x

  const currentPlayer = players[currentPlayerIndex] || null;

  const gamePhaseRef = useRef(gamePhase);
  useEffect(() => {
    gamePhaseRef.current = gamePhase;
  }, [gamePhase]);

  const handleStartGame = useCallback((newPlayers: Player[]) => {
    setPlayers(newPlayers.map(p => ({...p, isDelegatedThisTurn: false })));
    setCurrentPlayerIndex(0);
    setGamePhase(GamePhase.PLAYING);
    setLastSpinResult(null);
    setGameMessage(null);
    setActiveModalEvent(null);
  }, []);

  const updatePlayerState = useCallback((playerId: string, updates: Partial<Player>) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(p => (p.id === playerId ? { ...p, ...updates } : p))
    );
  }, []);

  // Effect to check for game over condition
  useEffect(() => {
    if ((gamePhaseRef.current === GamePhase.PLAYING || gamePhaseRef.current === GamePhase.EVENT_RESOLUTION) && players.length > 0) {
      const allRetired = players.every(p => p.isRetired);
      if (allRetired) {
        setGamePhase(GamePhase.GAME_OVER);
        // Set a clear game over message, potentially overriding others.
        setGameMessage("모든 플레이어가 은퇴했습니다! 게임 종료.");
        setActiveModalEvent(null);
        setLastSpinResult(null);
      }
    }
  }, [players, /* gamePhase is read via ref */ setGamePhase, setGameMessage, setActiveModalEvent, setLastSpinResult]);


  const handleToggleDelegation = useCallback(() => {
    if (currentPlayer && !currentPlayer.isCPU && gamePhaseRef.current === GamePhase.PLAYING && !activeModalEvent && lastSpinResult === null && !currentPlayer.missNextTurn && !currentPlayer.isRetired) {
      const newDelegationState = !currentPlayer.isDelegatedThisTurn;
      updatePlayerState(currentPlayer.id, { isDelegatedThisTurn: newDelegationState });
      if (newDelegationState) {
        setGameMessage(`${currentPlayer.name}님이 CPU에게 위임했습니다.`);
      } else {
         setGameMessage(`${currentPlayer.name}님이 CPU 위임을 해제했습니다.`);
      }
    }
  }, [currentPlayer, /* gamePhase read via ref */ activeModalEvent, lastSpinResult, updatePlayerState, setGameMessage]);

  const handleToggleSpeed = useCallback(() => {
    setGameSpeedMultiplier(prev => {
      if (prev === 1) return 0.5; // to 2x
      if (prev === 0.5) return 0.25; // to 4x
      return 1; // to 1x (Normal)
    });
  }, []);

  const getSpeedLabel = (multiplier: number): string => {
    if (multiplier === 0.5) return "2배속";
    if (multiplier === 0.25) return "4배속";
    return "일반";
  };

  const nextTurn = useCallback(() => {
    if (gamePhaseRef.current === GamePhase.GAME_OVER) {
        return;
    }

    setLastSpinResult(null);
    setActiveModalEvent(null);

    let tempMessageLog: string[] = [];
    let nextPlayerFound = false;
    let determinedNextIndex = currentPlayerIndex;

    if (players.length === 0) {
      setGamePhase(GamePhase.SETUP);
      return;
    }

    // Iterate through players in order, starting from the one after the current player.
    for (let i = 0; i < players.length; i++) {
        const potentialNextPlayerIndex = (currentPlayerIndex + 1 + i) % players.length;
        const potentialNextPlayer = players[potentialNextPlayerIndex];

        if (!potentialNextPlayer) continue;

        if (potentialNextPlayer.isRetired) {
            continue;
        }

        if (potentialNextPlayer.missNextTurn) {
            // Reset missNextTurn and also isDelegatedThisTurn, as they get a fresh choice next time
            updatePlayerState(potentialNextPlayer.id, { missNextTurn: false, isDelegatedThisTurn: false });
            tempMessageLog.push(`${potentialNextPlayer.name}님은 이번 턴을 쉽니다.`);
            continue;
        }

        determinedNextIndex = potentialNextPlayerIndex;
        nextPlayerFound = true;
        // Removed: Do not automatically reset delegation status here.
        // if (!potentialNextPlayer.isCPU && potentialNextPlayer.isDelegatedThisTurn) {
        //     updatePlayerState(potentialNextPlayer.id, { isDelegatedThisTurn: false });
        // }
        break;
    }

    if (tempMessageLog.length > 0) {
        setGameMessage(tempMessageLog.join(' '));
    }

    if (nextPlayerFound) {
         setCurrentPlayerIndex(determinedNextIndex);
         setGamePhase(GamePhase.PLAYING);
    } else if (players.length > 0 && !players.every(p => p.isRetired)) {
        // This block handles cases where all remaining active players might have been skipped
        // (e.g., due to missNextTurn). We need to find the first *actually* available player.
        let firstAvailableAfterSkips = -1;
        const searchStart = (currentPlayerIndex + 1) % players.length;
        for (let i = 0; i < players.length; i++) {
            const checkIndex = (searchStart + i) % players.length;
            const playerToCheck = players[checkIndex];
            if (playerToCheck && !playerToCheck.isRetired) { // Don't check missNextTurn here, it was handled above
                firstAvailableAfterSkips = checkIndex;
                break;
            }
        }

        if (firstAvailableAfterSkips !== -1) {
            setCurrentPlayerIndex(firstAvailableAfterSkips);
            setGamePhase(GamePhase.PLAYING);
            // Removed: Do not automatically reset delegation status here.
            // const firstPlayer = players[firstAvailableAfterSkips];
            // if (firstPlayer && !firstPlayer.isCPU && firstPlayer.isDelegatedThisTurn) {
            //     updatePlayerState(firstPlayer.id, { isDelegatedThisTurn: false });
            // }
        }
    }
    // If no next player is found (e.g., all retired, or some other logic prevents progression)
    // the game over check in useEffect should handle it.
  }, [currentPlayerIndex, players, updatePlayerState, /* activeModalEvent, not directly used for next player logic */ setGamePhase, setCurrentPlayerIndex, setGameMessage, setLastSpinResult, setActiveModalEvent]);


  const processSpaceAction = useCallback((playerFromSpin: Player, space: BoardSpace) => {
    const player = players.find(p => p.id === playerFromSpin.id) || playerFromSpin;

    let tempMessage = `${player.name}님이 '${space.description}' 칸에 도착했습니다.`;
    let playerUpdates: Partial<Player> = {};

    switch (space.type) {
      case SpaceType.PAYDAY:
      case SpaceType.GET_MONEY:
        if (space.actionPayload?.amount && space.actionPayload.amount > 0) {
          playerUpdates.money = player.money + space.actionPayload.amount;
          tempMessage += ` $${space.actionPayload.amount}을 획득했습니다.`;
        }
        break;
      case SpaceType.LOSE_MONEY:
        if (space.actionPayload?.amount && space.actionPayload.amount < 0) {
          playerUpdates.money = player.money + space.actionPayload.amount;
          tempMessage += ` $${Math.abs(space.actionPayload.amount)}을 지불했습니다.`;
        }
        break;
      case SpaceType.LIFE_EVENT:
      case SpaceType.ACTION_CHOICE:
      case SpaceType.STOP_SPACE:
        if (space.actionPayload?.eventKey) {
          const eventData = LIFE_EVENTS_DATA.find(e => e.key === space.actionPayload?.eventKey);
          if (eventData) {
            let playerForModal = player;
            if (Object.keys(playerUpdates).length > 0) {
                updatePlayerState(player.id, playerUpdates);
                playerForModal = { ...player, ...playerUpdates };
            }
            setActiveModalEvent({ type: 'life_event', data: eventData, messageLog: [tempMessage] });
            setGamePhase(GamePhase.EVENT_RESOLUTION);
            setGameMessage(null);
            return;
          } else {
            tempMessage += " 하지만 이벤트를 찾을 수 없습니다!";
          }
        } else if (space.type === SpaceType.STOP_SPACE && !space.actionPayload) {
            tempMessage += " 플레이어가 여기에 멈춥니다.";
        }
        break;
      case SpaceType.END:
        playerUpdates.isRetired = true;
        tempMessage += ` ${player.name}님이 은퇴했습니다!`;
        break;
    }

    setGameMessage(tempMessage);
    if (Object.keys(playerUpdates).length > 0) {
      updatePlayerState(player.id, playerUpdates);
    }

    setTimeout(() => {
      if (gamePhaseRef.current !== GamePhase.GAME_OVER) {
         nextTurn();
      }
    }, (tempMessage && tempMessage.length > 0 ? 2000 : 500) * gameSpeedMultiplier);

  }, [players, updatePlayerState, nextTurn, gameSpeedMultiplier, setActiveModalEvent, setGamePhase, setGameMessage]);


  const handleSpin = useCallback((spinAmount: number) => {
    const currentSpinPlayer = players[currentPlayerIndex];
    if (!currentSpinPlayer || currentSpinPlayer.isRetired || currentSpinPlayer.missNextTurn || gamePhaseRef.current === GamePhase.GAME_OVER) return;

    setLastSpinResult(spinAmount);
    let currentMessage = `${currentSpinPlayer.name}${currentSpinPlayer.isDelegatedThisTurn ? '(위임된 CPU)' : ''}님이 주사위를 굴려 ${spinAmount}이 나왔습니다.`;

    let newPosition = currentSpinPlayer.position + spinAmount;

    for(let i = currentSpinPlayer.position + 1; i <= newPosition; i++) {
        const pathSpaceIndex = i % TOTAL_SPACES;
        const pathSpace = boardSpaces[pathSpaceIndex];
        if(pathSpace.isStopSpace && pathSpaceIndex < TOTAL_SPACES - 1 && pathSpaceIndex < newPosition) {
            newPosition = pathSpaceIndex;
            currentMessage += ` '${pathSpace.description}' 칸에 반드시 정지해야 합니다.`;
            break;
        }
    }

    if (newPosition >= TOTAL_SPACES - 1) {
      newPosition = TOTAL_SPACES - 1;
      currentMessage += ` 종점에 도착했습니다!`;
    }

    setGameMessage(currentMessage);

    const playerWithNewPosition = { ...currentSpinPlayer, position: newPosition };
    setPlayers(prev => prev.map(p => p.id === currentSpinPlayer.id ? playerWithNewPosition : p));

    setTimeout(() => {
        processSpaceAction(playerWithNewPosition, boardSpaces[newPosition]);
    }, 1500 * gameSpeedMultiplier);

  }, [players, currentPlayerIndex, boardSpaces, processSpaceAction, gameSpeedMultiplier, setGameMessage, setPlayers, setLastSpinResult /* gamePhase read by ref */]);

  const handleResolveEventOption = useCallback((option: LifeEventOption) => {
    const playerForEffect = players.find(p => p.id === currentPlayer?.id);
    if (!playerForEffect || !activeModalEvent || gamePhaseRef.current === GamePhase.GAME_OVER) return;

    const { playerUpdate, message: effectMessage, followUpEventKey } = option.effect(playerForEffect, players);

    if (Object.keys(playerUpdate).length > 0) {
      updatePlayerState(playerForEffect.id, playerUpdate);
    }

    setActiveModalEvent(prev => prev ? ({ ...prev, messageLog: [...(prev.messageLog || []), effectMessage] }) : null);
    setGameMessage(effectMessage);

    setTimeout(() => {
        setActiveModalEvent(null);
        if (gamePhaseRef.current === GamePhase.GAME_OVER) return;

        if (followUpEventKey) {
            const eventData = LIFE_EVENTS_DATA.find(e => e.key === followUpEventKey);
            if (eventData) {
                // const updatedPlayerForFollowUp = players.find(p => p.id === playerForEffect.id) || playerForEffect; // Already have playerForEffect
                setActiveModalEvent({ type: 'life_event', data: eventData, messageLog: [effectMessage]});
                setGamePhase(GamePhase.EVENT_RESOLUTION);
                return;
            }
        }
        nextTurn();
    }, 2000 * gameSpeedMultiplier);
  }, [currentPlayer, players, activeModalEvent, updatePlayerState, nextTurn, gameSpeedMultiplier, setActiveModalEvent, setGameMessage, setGamePhase /* gamePhase read by ref */]);

  const handleCloseModal = useCallback((directEffectMessage?: string) => {
    const playerForEffect = players.find(p => p.id === currentPlayer?.id);
    if (!playerForEffect || !activeModalEvent) { // Game over check will be inside timeout or before nextTurn
        setActiveModalEvent(null);
        if (gamePhaseRef.current !== GamePhase.GAME_OVER) nextTurn();
        return;
    }
     if (gamePhaseRef.current === GamePhase.GAME_OVER && activeModalEvent) { // If game ended while modal was open
        setActiveModalEvent(null);
        return; // Don't proceed to nextTurn
    }


    const currentEventData = activeModalEvent.data;

    if(currentEventData.effect && !currentEventData.options){
        const {playerUpdate, message, followUpEventKey} = currentEventData.effect(playerForEffect, players);
        if (Object.keys(playerUpdate).length > 0) {
          updatePlayerState(playerForEffect.id, playerUpdate);
        }
        const finalMessage = directEffectMessage || message;
        setGameMessage(finalMessage);

        setTimeout(() => {
            setActiveModalEvent(null);
            if (gamePhaseRef.current === GamePhase.GAME_OVER) return;

            if (followUpEventKey) {
                const eventData = LIFE_EVENTS_DATA.find(e => e.key === followUpEventKey);
                if (eventData) {
                    // const updatedPlayerForFollowUp = players.find(p => p.id === playerForEffect.id) || playerForEffect;
                    setActiveModalEvent({ type: 'life_event', data: eventData, messageLog: [finalMessage]});
                    setGamePhase(GamePhase.EVENT_RESOLUTION);
                    return;
                }
            }
            nextTurn();
        }, 1500 * gameSpeedMultiplier);
        return;
    }

    setActiveModalEvent(null);
    if (gamePhaseRef.current !== GamePhase.GAME_OVER) nextTurn();
  }, [currentPlayer, activeModalEvent, players, updatePlayerState, nextTurn, gameSpeedMultiplier, /* gamePhase read by ref */ setActiveModalEvent, setGameMessage, setGamePhase]);

  // CPU Auto-Spin Logic
  useEffect(() => {
    const currentCpuPlayer = players[currentPlayerIndex];
    if (gamePhase === GamePhase.PLAYING && currentCpuPlayer && (currentCpuPlayer.isCPU || currentCpuPlayer.isDelegatedThisTurn) && !activeModalEvent && !currentCpuPlayer.missNextTurn && lastSpinResult === null && !currentCpuPlayer.isRetired) {
      setGameMessage(`${currentCpuPlayer.name} (${currentCpuPlayer.isCPU ? 'CPU' : '위임된 CPU'})가 주사위를 굴립니다...`);
      const timeoutId = setTimeout(() => {
        const freshCpuPlayer = players[currentPlayerIndex]; 
                                                         
        if (gamePhaseRef.current === GamePhase.PLAYING && freshCpuPlayer && (freshCpuPlayer.isCPU || freshCpuPlayer.isDelegatedThisTurn) && !activeModalEvent && !freshCpuPlayer.missNextTurn && lastSpinResult === null && !freshCpuPlayer.isRetired) {
            const cpuSpinResult = Math.floor(Math.random() * 6) + 1;
            handleSpin(cpuSpinResult);
        }
      }, 2000 * gameSpeedMultiplier);
      return () => clearTimeout(timeoutId);
    }
  }, [players, currentPlayerIndex, gamePhase, activeModalEvent, lastSpinResult, handleSpin, gameSpeedMultiplier, setGameMessage]);

  // CPU Auto-Event Resolution Logic
  useEffect(() => {
    const currentCpuPlayer = players[currentPlayerIndex];
    if (gamePhase === GamePhase.EVENT_RESOLUTION && activeModalEvent && currentCpuPlayer && (currentCpuPlayer.isCPU || currentCpuPlayer.isDelegatedThisTurn) && !currentCpuPlayer.isRetired) {
      const { data } = activeModalEvent;
      const cpuActionTimeout = 2500 * gameSpeedMultiplier;

      const timeoutId = setTimeout(() => {
        const freshCpuPlayer = players[currentPlayerIndex]; 
        if (gamePhaseRef.current === GamePhase.EVENT_RESOLUTION && activeModalEvent && freshCpuPlayer && (freshCpuPlayer.isCPU || freshCpuPlayer.isDelegatedThisTurn) && !freshCpuPlayer.isRetired) {
            setGameMessage(`${freshCpuPlayer.name} (${freshCpuPlayer.isCPU ? 'CPU' : '위임된 CPU'})가 '${data.title}' 이벤트에 대해 결정 중...`);
            if (data.options && data.options.length > 0) {
            const cpuChoice = data.options[Math.floor(Math.random() * data.options.length)];
            handleResolveEventOption(cpuChoice);
            } else if (data.effect) {
            handleCloseModal();
            } else {
            handleCloseModal();
            }
        }
      }, cpuActionTimeout);
      return () => clearTimeout(timeoutId);
    }
  }, [players, currentPlayerIndex, gamePhase, activeModalEvent, handleResolveEventOption, handleCloseModal, gameSpeedMultiplier, setGameMessage]);


  if (gamePhase === GamePhase.SETUP) {
    return <PlayerSetup onStartGame={handleStartGame} />;
  }

  if (gamePhase === GamePhase.GAME_OVER) {
    return <GameOverScreen players={players} onPlayAgain={() => {
        setGamePhase(GamePhase.SETUP);
        setPlayers([]);
        setCurrentPlayerIndex(0);
        setActiveModalEvent(null);
        setLastSpinResult(null);
        setGameMessage(null);
    }} />;
  }

  const isControlsDisabled =
    gamePhase === GamePhase.EVENT_RESOLUTION ||
    !!activeModalEvent ||
    (currentPlayer?.missNextTurn ?? false) ||
    !currentPlayer ||
    (currentPlayer?.isCPU ?? false) ||
    (currentPlayer?.isDelegatedThisTurn ?? false) ||
    lastSpinResult !== null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-sky-50 p-4 gap-4">
      <div className="lg:w-3/4 order-2 lg:order-1">
        <Board boardSpaces={boardSpaces} players={players} currentPlayerId={currentPlayer?.id} />
      </div>
      <div className="lg:w-1/4 order-1 lg:order-2 space-y-4 flex flex-col">
        <PlayerInfoPanel
            players={players}
            currentPlayerId={currentPlayer?.id || null}
            onToggleDelegation={handleToggleDelegation}
            gamePhase={gamePhase}
            activeModalEvent={activeModalEvent}
            lastSpinResult={lastSpinResult}
        />
        <GameControls
            currentPlayer={currentPlayer}
            onSpin={handleSpin}
            spinResult={lastSpinResult}
            isSpinDisabled={isControlsDisabled}
            gamePhase={gamePhase}
            gameSpeedMultiplier={gameSpeedMultiplier}
        />
        <button
          onClick={handleToggleSpeed}
          className="w-full px-4 py-2 text-sm font-semibold text-white bg-purple-500 rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-colors duration-150 ease-in-out"
          aria-label={`게임 속도 변경, 현재 ${getSpeedLabel(gameSpeedMultiplier)}`}
        >
          게임 속도: {getSpeedLabel(gameSpeedMultiplier)}
        </button>
        {gameMessage && (
            <div
              className="p-3 bg-indigo-100 text-indigo-700 rounded-md shadow text-sm text-center"
              role="alert"
              aria-live="polite"
            >
                {gameMessage}
            </div>
        )}
      </div>
      {activeModalEvent && currentPlayer && (
        <EventModal
          event={activeModalEvent}
          currentPlayer={players.find(p => p.id === currentPlayer.id) || currentPlayer}
          allPlayers={players}
          onResolveOption={handleResolveEventOption}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default App;
