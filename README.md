# 🎲 디지털 인생 게임 (Digital Life Game)

![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> 🌟 **인생의 주요 사건들을 경험하고, 선택을 내리고, 재정을 관리하여 성공을 목표로 하는 웹 기반 보드게임**

플레이어들은 게임 보드를 따라 이동하며 다양한 인생 이벤트, 금전적 변화, 선택의 순간들을 마주하게 됩니다. 최종적으로 가장 많은 자산을 모은 플레이어가 승리합니다!

실행 주소 : https://dev-canvas-pi.vercel.app/

---

## 📋 목차

- [🎯 주요 기능](#-주요-기능)
- [📁 프로젝트 구조](#-프로젝트-구조)
- [🚀 빠른 시작](#-빠른-시작)
- [🎮 게임 플레이 가이드](#-게임-플레이-가이드)
- [🛠️ 기술 스택](#️-기술-스택)
- [📸 스크린샷](#-스크린샷)
- [🤝 기여하기](#-기여하기)
- [📄 라이선스](#-라이선스)

---

## 🎯 주요 기능

### 👥 플레이어 관리
- **다중 플레이어 지원**: 2명~4명까지 플레이 가능
- **CPU 플레이어**: 혼자서도 즐길 수 있는 AI 플레이어
- **CPU 위임 기능**: 인간 플레이어가 턴을 CPU에게 위임 가능

### 🎲 게임 시스템
- **다이나믹 게임 보드**: 총 60칸의 다양한 이벤트 칸
- **턴제 시스템**: 주사위 기반의 직관적인 게임 진행
- **게임 속도 조절**: 일반/2배속/4배속 선택 가능

### 💰 재정 관리
- **월급 시스템**: 정기적인 수입 ($2,000)
- **다양한 이벤트**: 결혼, 주택 구매, 투자, 승진 등
- **자산 관리**: 수입과 지출을 통한 전략적 재정 운용

### 🎨 사용자 경험
- **미려한 UI/UX**: Tailwind CSS 기반의 모던한 디자인
- **반응형 디자인**: 다양한 화면 크기 지원
- **실시간 피드백**: 게임 상황과 이벤트 결과 즉시 표시

---

## 📁 프로젝트 구조

```
lifeGame/
├── 📄 index.html          # 메인 HTML 파일
├── 📄 index.tsx           # React 애플리케이션 진입점
├── 📄 App.tsx             # 핵심 게임 로직 및 UI
├── 📁 components/         # React 컴포넌트들
│   ├── Board.tsx          # 게임 보드 컴포넌트
│   ├── PlayerSetup.tsx    # 플레이어 설정 화면
│   └── EventModal.tsx     # 이벤트 모달 창
├── 📄 types.ts            # TypeScript 타입 정의
├── 📄 constants.ts        # 게임 상수 및 초기 데이터
├── 📄 metadata.json       # 애플리케이션 메타데이터
└── 📄 README.md           # 프로젝트 문서
```

---

## 🚀 빠른 시작

### ⚡ 즉시 실행 (권장)

별도의 설치 과정 없이 바로 게임을 즐길 수 있습니다!

1. **프로젝트 다운로드**
   ```bash
   git clone [repository-url]
   cd lifeGame
   ```

2. **게임 실행**
   - 웹 브라우저에서 `index.html` 파일을 직접 열기
   - 또는 Live Server 확장을 사용하여 실행

3. **브라우저 요구사항**
   - ✅ Chrome (권장)
   - ✅ Firefox
   - ✅ Edge
   - ✅ Safari

> 💡 **참고**: CDN을 통해 React 및 Tailwind CSS가 자동으로 로드되므로 별도의 빌드 과정이 필요하지 않습니다.

---

## 🎮 게임 플레이 가이드

### 1️⃣ 게임 설정

<details>
<summary><strong>플레이어 설정 방법</strong></summary>

1. **플레이어 수 선택**
   - 드롭다운 메뉴 또는 +/- 버튼 사용
   - 2명~4명 사이에서 선택

2. **플레이어 정보 입력**
   - 각 플레이어의 이름 입력 (선택사항)
   - CPU 플레이어 여부 설정
   - 기본값: 첫 번째 플레이어는 인간, 나머지는 CPU

3. **게임 시작**
   - "게임 시작!" 버튼 클릭

</details>

### 2️⃣ 게임 진행

<details>
<summary><strong>턴 진행 방식</strong></summary>

#### 🎲 주사위 굴리기
- **인간 플레이어**: "주사위 (1-6)" 버튼 클릭
- **CPU 플레이어**: 자동으로 진행

#### 🚶‍♂️ 이동 규칙
- 주사위 결과만큼 보드 위 이동
- "정지" 칸이 있으면 해당 칸에서 멈춤
- 각 칸의 지시에 따라 액션 수행

#### 📋 칸 유형별 액션
| 칸 유형 | 설명 | 액션 |
|---------|------|------|
| 🏠 시작 | 게임 시작 지점 | - |
| 💰 월급날 | 정기 수입 | $2,000 획득 |
| 🎉 이벤트 | 인생 이벤트 발생 | 모달 창에서 선택 |
| 💵 돈 획득/손실 | 즉시 자산 변동 | 표시된 금액만큼 변동 |
| ⏸️ 정지 칸 | 필수 정지 | 이벤트 처리 후 진행 |
| 🏖️ 은퇴 | 게임 종료 | 게임에서 은퇴 |

</details>

### 3️⃣ 특수 기능

<details>
<summary><strong>고급 기능 활용</strong></summary>

#### 🤖 CPU 위임
- 자신의 턴을 CPU에게 위임 가능
- 플레이어 패널의 토글 스위치 사용
- 수동 해제 또는 다음 턴까지 유지

#### ⚡ 게임 속도 조절
- 우측 하단 "게임 속도" 버튼
- 일반 / 2배속 / 4배속 선택
- 애니메이션 및 CPU 결정 시간 단축

#### 📢 게임 메시지
- 우측 하단에 실시간 상황 표시
- 이벤트 결과 및 게임 진행 상황 안내

</details>

### 4️⃣ 게임 종료

- **종료 조건**: 모든 플레이어가 은퇴 지점 도달
- **승리 조건**: 가장 많은 자산 보유 플레이어
- **순위 결정**: 최종 자산 기준으로 순위 매김
- **재시작**: "다시 플레이" 버튼으로 새 게임 시작

---

## 🛠️ 기술 스택

### Frontend
- **⚛️ React 18+**: 사용자 인터페이스 구축
- **📘 TypeScript**: 정적 타입 시스템으로 코드 안정성 향상
- **🎨 Tailwind CSS**: 유틸리티 우선 CSS 프레임워크

### 개발 환경
- **📦 ES Modules**: 브라우저 네이티브 모듈 시스템
- **🔗 Import Maps**: CDN 기반 라이브러리 로딩
- **⚡ Vite**: 빠른 개발 서버 및 빌드 도구

### 배포
- **🌐 Static Hosting**: 정적 파일 호스팅 지원
- **📱 Progressive Web App**: PWA 기능 지원 가능

---

## 📸 스크린샷

> 🚧 **개발 중**: 게임 스크린샷이 곧 추가될 예정입니다.

<details>
<summary><strong>예정된 스크린샷</strong></summary>

- 🎮 메인 게임 화면
- ⚙️ 플레이어 설정 화면  
- 🎲 게임 진행 화면
- 🏆 게임 종료 화면

</details>

---

## 🤝 기여하기

프로젝트 개선에 참여해주세요! 

### 🐛 버그 리포트
- GitHub Issues를 통해 버그 신고
- 재현 가능한 단계와 함께 상세한 설명 제공

### 💡 기능 제안
- 새로운 기능 아이디어 제안
- 사용자 경험 개선 방안 공유

### 🔧 개발 참여
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📝 코딩 가이드라인
- TypeScript 사용 필수
- ESLint 및 Prettier 설정 준수
- 컴포넌트별 단위 테스트 작성
- 한국어 주석으로 코드 설명

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

<div align="center">

**🎲 디지털 인생 게임과 함께 즐거운 시간 보내세요! 🎲**

Made with ❤️ by [Your Name]

[⬆️ 맨 위로 돌아가기](#-디지털-인생-게임-digital-life-game)

</div>
