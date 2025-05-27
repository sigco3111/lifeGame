
import { BoardSpace, LifeEventData, PlayerColorSet, SpaceType } from './types';

export const INITIAL_MONEY = 20000;
export const MAX_PLAYERS = 4;
export const MIN_PLAYERS = 2;
export const SPACES_PER_ROW = 10;
export const TOTAL_SPACES = 60; // 6 rows of 10

export const PLAYER_COLORS: PlayerColorSet[] = [
  { name: '진홍색', token: 'bg-red-500', text: 'text-red-700', border: 'border-red-700' },
  { name: '하늘색', token: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-700' },
  { name: '초록색', token: 'bg-green-500', text: 'text-green-700', border: 'border-green-700' },
  { name: '노란색', token: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-700' },
];

export const LIFE_EVENTS_DATA: LifeEventData[] = [
  {
    key: "foundTreasure",
    title: "보물 발견!",
    description: "숨겨진 상자를 발견했습니다. $5000 획득!",
    effect: (player) => ({ playerUpdate: { money: player.money + 5000 }, message: "$5000을 획득했습니다!" }),
  },
  {
    key: "unexpectedBill",
    title: "예상치 못한 청구서",
    description: "오래된 청구서가 나왔습니다. $2000 지불.",
    effect: (player) => ({ playerUpdate: { money: player.money - 2000 }, message: "$2000을 지불했습니다." }),
  },
  {
    key: "lotteryWin",
    title: "복권 당첨!",
    description: "복권에 당첨되었습니다! $10000 획득.",
    effect: (player) => ({ playerUpdate: { money: player.money + 10000 }, message: "$10000을 획득했습니다!" }),
  },
  {
    key: "stockMarketCrash",
    title: "주식 시장 붕괴",
    description: "투자가 타격을 입었습니다. $3000 손실.",
    effect: (player) => ({ playerUpdate: { money: player.money - 3000 }, message: "주식으로 $3000을 잃었습니다." }),
  },
  {
    key: "careerOpportunity",
    title: "경력 기회",
    description: "새로운 직업 제안! 자격증에 $1000이 필요하지만, 즉시 $3000의 보너스를 받을 수 있습니다.",
    options: [
      {
        text: "수락한다 (순이익 $2000)",
        effect: (player) => ({
          playerUpdate: { money: player.money - 1000 + 3000 },
          message: "새로운 직업을 수락하고 즉시 보너스 $3000을 받았습니다! (비용 $1000)",
        }),
      },
      { text: "거절한다", effect: (player) => ({ playerUpdate: {}, message: "제안을 거절했습니다." }) },
    ],
  },
  {
    key: "communityService",
    title: "사회봉사상",
    description: "자원봉사 활동이 인정받았습니다! $1500 획득.",
    effect: (player) => ({ playerUpdate: { money: player.money + 1500 }, message: "$1500 상금을 받았습니다." }),
  },
  {
    key: "speedingTicket",
    title: "과속 딱지",
    description: "이런, 너무 빨랐어요! 벌금 $500 지불.",
    effect: (player) => ({ playerUpdate: { money: player.money - 500 }, message: "벌금 $500을 지불했습니다." }),
  },
  {
    key: "inventorsGrant",
    title: "발명가 보조금",
    description: "훌륭한 아이디어로 보조금을 받았습니다! $7500 획득.",
    effect: (player) => ({ playerUpdate: { money: player.money + 7500 }, message: "$7500 보조금을 받았습니다!" }),
  },
  {
    key: "getMarried",
    title: "결혼하세요!",
    description: "축하합니다! 결혼 비용은 $3000입니다. 다른 모든 플레이어들이 각각 $500씩 선물을 줍니다.",
    effect: (currentPlayer, allPlayers) => {
      const giftPerPlayer = 500;
      const numberOfOtherPlayers = allPlayers.length -1;
      const totalGifts = numberOfOtherPlayers > 0 ? numberOfOtherPlayers * giftPerPlayer : 0;
      const netCost = 3000 - totalGifts;
      return { 
        playerUpdate: { money: currentPlayer.money - 3000 + totalGifts }, 
        message: `결혼했습니다! 총 선물 $${totalGifts}을(를) 받아, 순 비용은 $${netCost}입니다.`
      };
    }
  },
  {
    key: "buyHouse",
    title: "집을 사세요!",
    description: "꿈에 그리던 집을 찾았습니다. 계약금 $10000 지불.",
    effect: (player) => ({ playerUpdate: { money: player.money - 10000 }, message: "집을 샀습니다! $10000 지불." }),
  },
  // New Events Start Here
  {
    key: "goToCollege",
    title: "대학교 입학",
    description: "미래를 위한 투자! 대학교에 입학하여 학비로 $5000을 지불합니다. 졸업하면 더 나은 기회가 있을 거예요!",
    effect: (player) => ({ playerUpdate: { money: player.money - 5000 }, message: "대학교 입학! 학비 $5000 지불. 현명한 선택이길!" }),
  },
  {
    key: "nightSchool",
    title: "야간 대학 등록",
    description: "자기 계발을 위해 야간 대학에 등록합니다. 학비 $2000. 지식이 곧 힘!",
    effect: (player) => ({ playerUpdate: { money: player.money - 2000}, message: "야간 대학 등록! 학비 $2000 지불." })
  },
  {
    key: "promotion",
    title: "승진!",
    description: "능력을 인정받아 승진했습니다! 축하 보너스로 $5000을 받습니다.",
    effect: (player) => ({ playerUpdate: { money: player.money + 5000 }, message: "승진! 보너스 $5000 획득." }),
  },
  {
    key: "jobLoss",
    title: "실직",
    description: "회사가 어려워져 일자리를 잃었습니다. 당분간 생활비로 $2000을 사용합니다.",
    effect: (player) => ({ playerUpdate: { money: player.money - 2000 }, message: "실직으로 인해 $2000 지출." }),
  },
  {
    key: "startupSuccess",
    title: "스타트업 대박!",
    description: "당신의 스타트업 아이디어가 대성공을 거두었습니다! $20000 즉시 획득.",
    effect: (player) => ({ playerUpdate: { money: player.money + 20000 }, message: "스타트업 성공! $20000 획득!" }),
  },
  {
    key: "startupFail",
    title: "스타트업 실패...",
    description: "아쉽지만, 스타트업이 잘 되지 않았습니다. 투자금 $5000 손실.",
    effect: (player) => ({ playerUpdate: { money: player.money - 5000 }, message: "스타트업 실패. $5000 손실." }),
  },
  {
    key: "haveChild",
    title: "자녀 출생!",
    description: "새 가족이 생겼습니다! 다른 모든 플레이어로부터 $300씩 축하금을 받고, 육아용품 구입으로 $1000을 지출합니다.",
    effect: (currentPlayer, allPlayers) => {
      const giftPerPlayer = 300;
      const numberOfOtherPlayers = allPlayers.length - 1;
      const totalGifts = numberOfOtherPlayers > 0 ? numberOfOtherPlayers * giftPerPlayer : 0;
      const netAmount = totalGifts - 1000;
      return {
        playerUpdate: { money: currentPlayer.money + netAmount },
        message: `자녀 출생! 총 축하금 $${totalGifts}을(를) 받고 육아용품 $1000을 지출하여, 순 $${netAmount} 변동.`
      };
    }
  },
  {
    key: "twins",
    title: "쌍둥이 출생!",
    description: "겹경사! 두 배의 기쁨, 두 배의 지출. 모든 플레이어로부터 $500씩 받고, $2500 즉시 지출.",
     effect: (currentPlayer, allPlayers) => {
      const giftPerPlayer = 500;
      const numberOfOtherPlayers = allPlayers.length - 1;
      const totalGifts = numberOfOtherPlayers > 0 ? numberOfOtherPlayers * giftPerPlayer : 0;
      const netAmount = totalGifts - 2500;
      return {
        playerUpdate: { money: currentPlayer.money + netAmount },
        message: `쌍둥이 출생! 총 축하금 $${totalGifts}을(를) 받고 $2500을 지출하여, 순 $${netAmount} 변동.`
      };
    }
  },
  {
    key: "inheritMoney",
    title: "유산 상속",
    description: "먼 친척으로부터 유산을 상속받았습니다. $12000 획득.",
    effect: (player) => ({ playerUpdate: { money: player.money + 12000 }, message: "유산 $12000 상속!" }),
  },
  {
    key: "taxAudit",
    title: "세무 조사",
    description: "세무 조사를 받았습니다. 예상치 못한 추가 세금 $2500 지불.",
    effect: (player) => ({ playerUpdate: { money: player.money - 2500 }, message: "세무 조사 결과, 추가 세금 $2500 지불." }),
  },
  {
    key: "payTaxes",
    title: "세금 납부의 달",
    description: "이번 달은 세금 납부의 달입니다. 소득세 $1500 납부.",
    effect: (player) => ({ playerUpdate: { money: player.money - 1500 }, message: "소득세 $1500 납부 완료." }),
  },
  {
    key: "investmentWin",
    title: "투자 대박",
    description: "현명한 투자 결정! $7000 수익 발생.",
    effect: (player) => ({ playerUpdate: { money: player.money + 7000 }, message: "투자 성공! $7000 수익." }),
  },
  {
    key: "investmentLoss",
    title: "투자 실패",
    description: "잘못된 투자로 $4000 손실을 입었습니다.",
    effect: (player) => ({ playerUpdate: { money: player.money - 4000 }, message: "투자 실패. $4000 손실." }),
  },
  {
    key: "winCompetition",
    title: "경연대회 우승",
    description: "숨겨왔던 재능을 뽐내 경연대회에서 우승했습니다! 상금 $3000.",
    effect: (player) => ({ playerUpdate: { money: player.money + 3000 }, message: "경연대회 우승! 상금 $3000 획득." }),
  },
  {
    key: "minorAccident",
    title: "작은 사고",
    description: "부주의로 작은 사고가 발생했습니다. 수리비 $1000 지불.",
    effect: (player) => ({ playerUpdate: { money: player.money - 1000 }, message: "작은 사고 발생. 수리비 $1000 지불." }),
  },
  {
    key: "carRepair",
    title: "자동차 수리",
    description: "애마가 고장났습니다. 예상치 못한 자동차 수리비 $800 발생.",
    effect: (player) => ({ playerUpdate: { money: player.money - 800 }, message: "자동차 수리비 $800 지불." }),
  },
  {
    key: "homeReno",
    title: "집 리모델링",
    description: "더 안락한 보금자리를 위해 집을 리모델링합니다. $6000 지출.",
    effect: (player) => ({ playerUpdate: { money: player.money - 6000 }, message: "집 리모델링에 $6000 지출." }),
  },
  {
    key: "helpFriend",
    title: "친구 돕기",
    description: "어려움에 처한 친구를 돕기로 했습니다. $1500 지출.",
    effect: (player) => ({ playerUpdate: { money: player.money - 1500 }, message: "친구를 돕기 위해 $1500 지출." }),
  },
  {
    key: "unexpectedGift",
    title: "뜻밖의 선물",
    description: "친구가 고마움의 표시로 선물을 주었습니다. $2000 획득.",
    effect: (player) => ({ playerUpdate: { money: player.money + 2000 }, message: "친구로부터 $2000 선물 받음!" }),
  },
  {
    key: "goodDeedReward",
    title: "선행 보상",
    description: "당신의 선행이 알려져 지역사회로부터 $1000 포상을 받았습니다.",
    effect: (player) => ({ playerUpdate: { money: player.money + 1000 }, message: "선행 보상으로 $1000 획득!" }),
  },
  {
    key: "scammed",
    title: "사기 당함",
    description: "안타깝게도 사기를 당했습니다. $3500 손실.",
    effect: (player) => ({ playerUpdate: { money: player.money - 3500 }, message: "사기 피해 발생. $3500 손실." }),
  },
  {
    key: "bonus",
    title: "연말 보너스!",
    description: "회계 연도 마감! 수고한 당신에게 $2500 보너스 지급!",
    effect: (player) => ({ playerUpdate: { money: player.money + 2500 }, message: "연말 보너스 $2500 획득!"}),
  },
  {
    key: "sellOldStuff",
    title: "중고 물품 판매",
    description: "집에서 안쓰는 물건들을 정리하여 팔았습니다. $700 용돈 마련.",
    effect: (player) => ({ playerUpdate: { money: player.money + 700 }, message: "중고 물품 판매로 $700 획득."}),
  },
  {
    key: "gamblingWin",
    title: "도박으로 한탕!",
    description: "오늘 운수 좋은 날! 가벼운 마음으로 한 도박에서 $4000을 땄습니다.",
    effect: (player) => ({ playerUpdate: { money: player.money + 4000 }, message: "도박 성공! $4000 획득."}),
  },
  {
    key: "gamblingLoss",
    title: "도박으로 파산 직전",
    description: "무리한 도박은 금물! 결국 $3000을 잃었습니다.",
    effect: (player) => ({ playerUpdate: { money: player.money - 3000 }, message: "도박 실패. $3000 손실."}),
  },
  {
    key: "midlifeCrisis",
    title: "중년의 위기!",
    description: "인생의 전환점, 새로운 것을 시도해볼까요? 값비싼 스포츠카를 사거나 세계 일주를 떠나며 $4000을 지출할 수 있습니다.",
    options: [
      {
        text: "과감하게 지른다! (-$4000)",
        effect: (player) => ({ playerUpdate: { money: player.money - 4000 }, message: "중년의 위기 극복! 새로운 경험에 $4000 지출." }),
      },
      { text: "조용히 넘어간다", effect: (player) => ({ playerUpdate: {}, message: "현실을 직시하고 위기를 넘겼습니다." }) },
    ],
  },
  {
    key: "volunteerTrip",
    title: "해외 봉사활동",
    description: "의미있는 경험을 위해 해외 봉사활동에 참여합니다. 참가비 $3000. 한 턴 동안 자리를 비웁니다.",
    effect: (player) => ({ playerUpdate: { money: player.money - 3000, missNextTurn: true }, message: "해외 봉사활동 참가! $3000 지출 및 다음 턴 휴식." }),
  },
  {
    key: "juryDuty",
    title: "배심원 소집",
    description: "시민의 의무를 다하기 위해 배심원으로 소집되었습니다. 일당 $100을 받고, 한 턴 동안 참여합니다.",
    effect: (player) => ({ playerUpdate: { money: player.money + 100, missNextTurn: true }, message: "배심원 참여! 일당 $100 획득 및 다음 턴 휴식." }),
  },
];

const directEffectEvents = LIFE_EVENTS_DATA.filter(event => !event.options || event.options.length === 0);
const choiceEvents = LIFE_EVENTS_DATA.filter(event => event.options && event.options.length > 0);


export const INITIAL_BOARD_SPACES: BoardSpace[] = Array.from({ length: TOTAL_SPACES }, (_, i) => {
  const space: BoardSpace = {
    id: i,
    type: SpaceType.EMPTY,
    description: "통과",
    color: "bg-slate-200 hover:bg-slate-300",
  };

  if (i === 0) {
    space.type = SpaceType.START;
    space.description = "시작!";
    space.color = "bg-green-500 text-white";
    return space;
  }
  if (i === TOTAL_SPACES - 1) {
    space.type = SpaceType.END;
    space.description = "은퇴! 축하합니다!";
    space.color = "bg-purple-600 text-white";
    return space;
  }

  // Ensure some variety and prevent all spaces from being events
  const randomNumber = Math.random();

  if (i % 7 === 0 && i !== 0) { // Approx 8 Paydays
    space.type = SpaceType.PAYDAY;
    space.description = "월급날! $2000";
    space.color = "bg-yellow-400 text-gray-800 hover:bg-yellow-500";
    space.actionPayload = { amount: 2000 };
  } else if (i === 15 || i === 45) { // Fixed stop spaces
    space.type = SpaceType.STOP_SPACE;
    space.description = "정지! 결혼";
    space.color = "bg-pink-500 text-white hover:bg-pink-600";
    space.isStopSpace = true;
    space.actionPayload = { eventKey: "getMarried" };
  } else if (i === 30 || i === 55) { // Fixed stop spaces
    space.type = SpaceType.STOP_SPACE;
    space.description = "정지! 집 구매";
    space.color = "bg-orange-500 text-white hover:bg-orange-600";
    space.isStopSpace = true;
    space.actionPayload = { eventKey: "buyHouse" };
  } else if (randomNumber < 0.25 && directEffectEvents.length > 0) { // ~25% chance for a Life Event (direct)
    space.type = SpaceType.LIFE_EVENT;
    const randomEvent = directEffectEvents[Math.floor(Math.random() * directEffectEvents.length)];
    space.description = "인생 카드"; // Generic description, modal shows specific event.
    space.color = "bg-blue-400 text-white hover:bg-blue-500";
    space.actionPayload = { eventKey: randomEvent.key };
  } else if (randomNumber >= 0.25 && randomNumber < 0.40 && choiceEvents.length > 0) { // ~15% chance for an Action Choice
     space.type = SpaceType.ACTION_CHOICE;
     const randomChoiceEvent = choiceEvents[Math.floor(Math.random() * choiceEvents.length)];
     space.description = "선택 카드"; // Generic description
     space.color = "bg-indigo-400 text-white hover:bg-indigo-500";
     space.actionPayload = { eventKey: randomChoiceEvent.key };
  } else if (randomNumber >= 0.40 && randomNumber < 0.55) { // ~15% chance for Get Money
    space.type = SpaceType.GET_MONEY;
    const amount = (Math.floor(Math.random() * 10) + 1) * 100; // $100 to $1000
    space.description = `$${amount} 발견!`;
    space.color = "bg-lime-400 text-gray-800 hover:bg-lime-500";
    space.actionPayload = { amount };
  } else if (randomNumber >= 0.55 && randomNumber < 0.70) { // ~15% chance for Lose Money
    space.type = SpaceType.LOSE_MONEY;
    const amount = (Math.floor(Math.random() * 10) + 1) * -100; // -$100 to -$1000
    space.description = `벌금 $${Math.abs(amount)}`;
    space.color = "bg-red-400 text-white hover:bg-red-500";
    space.actionPayload = { amount };
  } else { 
    // Default to EMPTY space if no other condition met, or to ensure not too many event spaces
    // This covers the remaining ~30%
    space.type = SpaceType.EMPTY;
    space.description = "통과";
    // Give EMPTY spaces slightly different colors for visual variety
    const emptyColors = ["bg-slate-200 hover:bg-slate-300", "bg-stone-200 hover:bg-stone-300", "bg-neutral-200 hover:bg-neutral-300"];
    space.color = emptyColors[Math.floor(Math.random() * emptyColors.length)];
  }
  
  // Ensure critical spaces (START, END, fixed STOP_SPACE, PAYDAY) are not overwritten by random logic
  if (i === 0) {
    space.type = SpaceType.START; space.description = "시작!"; space.color = "bg-green-500 text-white"; space.actionPayload=undefined;
  } else if (i === TOTAL_SPACES - 1) {
    space.type = SpaceType.END; space.description = "은퇴! 축하합니다!"; space.color = "bg-purple-600 text-white";space.actionPayload=undefined;
  } else if (i % 7 === 0 && i !== 0) {
    space.type = SpaceType.PAYDAY; space.description = "월급날! $2000"; space.color = "bg-yellow-400 text-gray-800 hover:bg-yellow-500"; space.actionPayload = { amount: 2000 };
  } else if (i === 15 || i === 45) {
    space.type = SpaceType.STOP_SPACE; space.description = "정지! 결혼"; space.color = "bg-pink-500 text-white hover:bg-pink-600"; space.isStopSpace = true; space.actionPayload = { eventKey: "getMarried" };
  } else if (i === 30 || i === 55) {
    space.type = SpaceType.STOP_SPACE; space.description = "정지! 집 구매"; space.color = "bg-orange-500 text-white hover:bg-orange-600"; space.isStopSpace = true; space.actionPayload = { eventKey: "buyHouse" };
  }


  return space;
});
