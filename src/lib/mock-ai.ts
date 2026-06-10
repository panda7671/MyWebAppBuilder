import { AppPlan, Project, Question, Screen, UIComponent, UISchema } from '@/types'

const DOMAIN_PLACEHOLDERS: [string[], Record<string, string>][] = [
  [
    ['중고', '거래', '판매', '구매'],
    {
      q1: '예: 20~40대 일반인, 동네 주민',
      q2: '예: 사진을 올려서 중고 물건 팔기',
      q3: '예: 내 주변 중고 물건 목록',
      q4: '예: 물건 사진 올리기, 채팅하기',
      q5: '예: 깔끔하고 신뢰감 있는',
    },
  ],
  [
    ['음식', '맛집', '배달', '식당'],
    {
      q1: '예: 음식에 관심 많은 20~30대',
      q2: '예: 가까운 맛집을 지도에서 찾기',
      q3: '예: 내 주변 인기 맛집 지도',
      q4: '예: 맛집 검색하기, 리뷰 남기기',
      q5: '예: 따뜻하고 식욕 돋는',
    },
  ],
  [
    ['운동', '헬스', '피트니스', '다이어트'],
    {
      q1: '예: 건강 관리에 관심 있는 직장인',
      q2: '예: 매일 운동 기록하고 목표 달성 확인',
      q3: '예: 오늘 운동 요약과 달성률',
      q4: '예: 운동 기록 추가하기, 목표 확인하기',
      q5: '예: 활기차고 동기부여 되는',
    },
  ],
  [
    ['공부', '학습', '교육', '강의'],
    {
      q1: '예: 자격증 준비 중인 학생, 직장인',
      q2: '예: 강의 듣고 퀴즈로 복습하기',
      q3: '예: 오늘 학습 진도와 이어서 볼 강의',
      q4: '예: 강의 듣기, 퀴즈 풀기',
      q5: '예: 집중력 있고 차분한',
    },
  ],
  [
    ['일정', '스케줄', '캘린더', '계획'],
    {
      q1: '예: 바쁜 일상을 관리하고 싶은 직장인',
      q2: '예: 일정 추가하고 알림 받기',
      q3: '예: 오늘 일정 한눈에 보기',
      q4: '예: 일정 추가하기, 알림 설정하기',
      q5: '예: 정돈되고 효율적인',
    },
  ],
  [
    ['가계부', '지출', '예산', '금융', '저축'],
    {
      q1: '예: 소비를 줄이고 싶은 20~30대',
      q2: '예: 지출 기록하고 월별 통계 보기',
      q3: '예: 이번 달 지출 요약',
      q4: '예: 지출 기록하기, 통계 확인하기',
      q5: '예: 신뢰감 있고 깔끔한',
    },
  ],
  [
    ['커뮤니티', '동네', '이웃', '주민'],
    {
      q1: '예: 같은 동네에 사는 주민',
      q2: '예: 동네 소식과 이웃끼리 소통',
      q3: '예: 우리 동네 최신 게시글',
      q4: '예: 게시글 작성하기, 댓글 달기',
      q5: '예: 따뜻하고 친근한',
    },
  ],
]

const DEFAULT_PLACEHOLDERS: Record<string, string> = {
  q1: '예: 학생, 직장인, 소상공인 등',
  q2: '예: 사용자가 가장 많이 쓰는 핵심 기능',
  q3: '예: 메인 콘텐츠 목록 또는 대시보드',
  q4: '예: 물건 올리기, 예약하기, 기록 추가하기, 채팅하기',
  q5: '예: 심플, 귀여움, 전문적',
}

function detectPlaceholders(description: string): Record<string, string> {
  for (const [keywords, placeholders] of DOMAIN_PLACEHOLDERS) {
    if (keywords.some((k) => description.includes(k))) return placeholders
  }
  return DEFAULT_PLACEHOLDERS
}

export function generateQuestions(description: string): Question[] {
  const placeholders = detectPlaceholders(description)
  return [
    {
      id: 'q1',
      text: '이 앱을 주로 누가 사용할 예정인가요?',
      answer: '',
      placeholder: placeholders.q1,
    },
    {
      id: 'q2',
      text: '앱에서 가장 중요한 기능 한 가지를 설명해주세요.',
      answer: '',
      placeholder: placeholders.q2,
    },
    {
      id: 'q3',
      text: '사용자가 처음 앱을 열었을 때 무엇을 보게 되길 원하나요?',
      answer: '',
      placeholder: placeholders.q3,
    },
    {
      id: 'q4',
      text: '사용자가 앱에서 가장 자주 할 행동은 무엇인가요?',
      answer: '',
      placeholder: placeholders.q4,
    },
    {
      id: 'q5',
      text: '앱의 전체적인 분위기를 한 단어로 표현한다면?',
      answer: '',
      placeholder: placeholders.q5,
    },
  ]
}

// ─── Plan generation ────────────────────────────────────────────────────────

// 규칙: 배열 내 키워드가 모두(every) 설명에 포함될 때 해당 이름 사용.
// 복합 키워드(2개 이상) 규칙이 단일 키워드 규칙보다 앞에 와야 더 구체적인 이름을 우선 선택함.
const APP_NAME_RULES: [string[], string][] = [
  // 복합 키워드 규칙 (더 구체적 → 먼저)
  [['중고', '동네'], '동네마켓'],
  [['중고', '주민'], '동네마켓'],
  [['중고', '거래'], '중고장터'],
  [['중고', '판매'], '중고장터'],
  [['맛집', '공유'], '맛집노트'],
  [['맛집', '추천'], '맛집추천'],
  [['맛집', '지도'], '맛집지도'],
  [['음식', '배달'], '배달앱'],
  [['카페', '예약'], '카페예약'],
  [['식당', '예약'], '식당예약'],
  [['예약', '관리'], '예약관리'],
  [['운동', '기록'], '운동기록'],
  [['운동', '통계'], '운동기록'],
  [['헬스', '기록'], '운동기록'],
  [['다이어트', '기록'], '다이어트기록'],
  [['공부', '기록'], '공부기록'],
  [['학습', '관리'], '학습관리'],
  [['강의', '관리'], '강의노트'],
  [['출석', '관리'], '출석관리'],
  [['숙제', '관리'], '숙제관리'],
  [['학생', '관리'], '학생관리'],
  [['손님', '관리'], '고객관리'],
  [['고객', '관리'], '고객관리'],
  [['일정', '관리'], '일정관리'],
  [['스케줄', '관리'], '일정관리'],
  [['여행', '기록'], '여행기록'],
  [['여행', '계획'], '여행플래너'],
  [['수입', '지출'], '생활가계부'],
  [['지출', '기록'], '생활가계부'],
  [['예산', '관리'], '예산관리'],
  [['동네', '소식'], '동네소식'],
  [['이웃', '소통'], '이웃소통'],
  [['주민', '소통'], '동네소식'],
  [['채용', '관리'], '채용관리'],
  // 단일 키워드 폴백
  [['중고'], '중고장터'],
  [['맛집'], '맛집노트'],
  [['음식'], '음식추천'],
  [['배달'], '배달앱'],
  [['카페'], '카페관리'],
  [['운동'], '운동기록'],
  [['헬스'], '운동기록'],
  [['피트니스'], '운동기록'],
  [['다이어트'], '다이어트기록'],
  [['공부'], '공부기록'],
  [['학습'], '학습관리'],
  [['교육'], '학습관리'],
  [['강의'], '강의노트'],
  [['출석'], '출석관리'],
  [['일정'], '일정관리'],
  [['스케줄'], '일정관리'],
  [['캘린더'], '일정관리'],
  [['여행'], '여행플래너'],
  [['숙박'], '숙박예약'],
  [['쇼핑'], '쇼핑목록'],
  [['가계부'], '생활가계부'],
  [['지출'], '가계부'],
  [['예산'], '예산관리'],
  [['저축'], '저축관리'],
  [['동네'], '동네소식'],
  [['커뮤니티'], '커뮤니티'],
  [['이웃'], '이웃소통'],
  [['주민'], '동네소식'],
  [['채용'], '취업노트'],
  [['구직'], '취업노트'],
  [['이력서'], '이력서관리'],
]

export function generateAppName(description: string): string {
  for (const [keywords, name] of APP_NAME_RULES) {
    if (keywords.every((k) => description.includes(k))) return name
  }
  return '나만의 앱'
}

const FEATURE_MAP: [string[], string][] = [
  [['사진', '이미지', '갤러리'], '사진 업로드 및 갤러리'],
  [['채팅', '메시지', '대화', '소통'], '실시간 채팅'],
  [['지도', '위치', '근처', '동네', '주변'], '위치 기반 서비스'],
  [['결제', '구매', '쇼핑', '판매', '거래'], '결제 시스템'],
  [['검색', '찾기'], '검색 기능'],
  [['알림', '푸시'], '푸시 알림'],
  [['일정', '캘린더', '날짜'], '일정 관리'],
  [['공유', '나누기', '공유하기'], '콘텐츠 공유'],
  [['리뷰', '평점', '후기'], '리뷰 및 평점'],
  [['게시판', '글', '포스트', '피드'], '커뮤니티 게시판'],
  [['통계', '분석', '차트', '그래프'], '통계 및 분석'],
  [['친구', '팔로우', '팔로워'], '소셜 기능'],
]

function extractFeatures(text: string): string[] {
  const features: string[] = []
  for (const [keywords, feature] of FEATURE_MAP) {
    if (keywords.some((k) => text.includes(k))) features.push(feature)
  }
  if (!features.some((f) => f.includes('로그인'))) {
    features.unshift('회원가입 및 로그인')
  }
  if (features.length < 3) features.push('메인 대시보드', '개인 설정')
  return features.slice(0, 5)
}

// ─── Screen generation ───────────────────────────────────────────────────────

type ScreenTemplate = { name: string; description: string; components: UIComponent[] }

function makeScreen(id: string, tpl: ScreenTemplate): Screen {
  return { id, ...tpl }
}

const HOME_SCREEN = (appName: string): Screen =>
  makeScreen('home', {
    name: '홈',
    description: `${appName}의 메인 화면`,
    components: [
      { type: 'header', label: appName },
      { type: 'nav', label: '하단 네비게이션' },
      { type: 'list', label: '주요 콘텐츠 목록' },
    ],
  })

const SETTINGS_SCREEN: Screen = makeScreen('settings', {
  name: '설정',
  description: '프로필, 알림, 테마 등 앱 설정 관리',
  components: [
    { type: 'header', label: '설정' },
    { type: 'list', label: '설정 항목' },
  ],
})

const FEATURE_SCREENS: [string[], Screen][] = [
  [
    ['로그인', '회원가입'],
    makeScreen('login', {
      name: '로그인',
      description: '이메일과 비밀번호로 로그인하거나 회원가입',
      components: [
        { type: 'header', label: '로그인' },
        { type: 'form', label: '이메일 / 비밀번호' },
        { type: 'button', label: '로그인' },
        { type: 'text', label: '회원가입 링크' },
      ],
    }),
  ],
  [
    ['검색'],
    makeScreen('search', {
      name: '검색',
      description: '원하는 콘텐츠를 검색',
      components: [
        { type: 'header', label: '검색' },
        { type: 'form', label: '검색어 입력' },
        { type: 'list', label: '검색 결과' },
      ],
    }),
  ],
  [
    ['채팅', '메시지'],
    makeScreen('chat', {
      name: '채팅',
      description: '실시간 메시지를 주고받는 채팅 화면',
      components: [
        { type: 'header', label: '채팅' },
        { type: 'list', label: '채팅방 목록' },
      ],
    }),
  ],
  [
    ['결제', '구매'],
    makeScreen('payment', {
      name: '결제',
      description: '상품을 구매하고 결제하는 화면',
      components: [
        { type: 'header', label: '결제' },
        { type: 'card', label: '주문 요약' },
        { type: 'form', label: '결제 정보' },
        { type: 'button', label: '결제하기' },
      ],
    }),
  ],
  [
    ['게시판', '커뮤니티'],
    makeScreen('board', {
      name: '게시판',
      description: '사용자들이 글을 쓰고 소통하는 공간',
      components: [
        { type: 'header', label: '게시판' },
        { type: 'list', label: '게시글 목록' },
        { type: 'button', label: '글쓰기' },
      ],
    }),
  ],
  [
    ['리뷰', '평점'],
    makeScreen('detail', {
      name: '상세',
      description: '상품 또는 서비스의 상세 정보와 리뷰',
      components: [
        { type: 'header', label: '상세 정보' },
        { type: 'image-placeholder', label: '대표 이미지' },
        { type: 'text', label: '설명' },
        { type: 'list', label: '리뷰 목록' },
      ],
    }),
  ],
  [
    ['일정', '캘린더'],
    makeScreen('calendar', {
      name: '일정',
      description: '일정을 확인하고 추가하는 캘린더',
      components: [
        { type: 'header', label: '일정' },
        { type: 'card', label: '캘린더' },
        { type: 'list', label: '예정 일정 목록' },
      ],
    }),
  ],
  [
    ['위치', '지도'],
    makeScreen('map', {
      name: '지도',
      description: '위치 기반으로 주변 정보를 확인',
      components: [
        { type: 'header', label: '지도' },
        { type: 'image-placeholder', label: '지도 영역' },
        { type: 'list', label: '주변 목록' },
      ],
    }),
  ],
  [
    ['통계', '분석'],
    makeScreen('stats', {
      name: '통계',
      description: '데이터를 시각화하여 분석하는 화면',
      components: [
        { type: 'header', label: '통계' },
        { type: 'card', label: '주요 지표' },
        { type: 'image-placeholder', label: '차트 영역' },
      ],
    }),
  ],
  [
    ['소셜', '친구', '팔로우'],
    makeScreen('social', {
      name: '친구',
      description: '친구 목록과 소셜 활동',
      components: [
        { type: 'header', label: '친구' },
        { type: 'list', label: '친구 목록' },
        { type: 'button', label: '친구 추가' },
      ],
    }),
  ],
]

export function generateScreens(project: Project): Screen[] {
  const features = project.plan.coreFeatures
  const screens: Screen[] = [HOME_SCREEN(project.plan.appName)]

  for (const [keywords, screen] of FEATURE_SCREENS) {
    if (features.some((f) => keywords.some((k) => f.includes(k)))) {
      screens.push(screen)
    }
  }

  screens.push(SETTINGS_SCREEN)
  return screens
}

export function generateApp(plan: AppPlan): UISchema {
  const features = plan.coreFeatures.slice(0, 4)
  const cards =
    features.length > 0
      ? features.map((f) => ({ title: f, description: `${plan.appName}의 핵심 기능입니다.` }))
      : [
          { title: '기능 1', description: '주요 기능을 소개합니다.' },
          { title: '기능 2', description: '편리한 기능을 제공합니다.' },
        ]

  return {
    appName: plan.appName,
    theme: { primaryColor: '#4F46E5', style: 'minimal' },
    sections: [
      {
        type: 'Hero',
        title: `${plan.appName}에 오신 것을 환영합니다`,
        subtitle: plan.purpose,
        ctaText: '시작하기',
      },
      { type: 'CardGrid', title: '핵심 기능', cards },
      {
        type: 'List',
        title: '최근 활동',
        items: [
          { title: '새 항목이 추가되었습니다', meta: '방금 전', badge: 'NEW' },
          { title: '업데이트가 완료되었습니다', meta: '1시간 전' },
          { title: '알림이 도착했습니다', meta: '어제' },
        ],
      },
      {
        type: 'Form',
        title: '시작하기',
        fields: [
          { label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
          { label: '이메일', type: 'email', placeholder: '이메일을 입력하세요', required: true },
        ],
        submitText: '가입하기',
      },
    ],
  }
}

export function generatePlan(project: Project): AppPlan {
  const desc = project.input.description
  const answers: Record<string, string> = {}
  project.qa.questions.forEach((q) => {
    answers[q.id] = q.answer
  })

  const combined = desc + ' ' + Object.values(answers).join(' ')

  return {
    appName: generateAppName(desc),
    purpose: desc.length > 80 ? desc.slice(0, 80).trimEnd() + '…' : desc,
    targetUser: answers['q1'] || '일반 사용자',
    coreFeatures: extractFeatures(combined),
    techStack: ['React', 'Next.js', 'Tailwind CSS'],
  }
}
