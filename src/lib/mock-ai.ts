import { AppPlan, Project, Question, Screen, UIComponent, UISchema } from '@/types'
import type { UISection, UITheme } from '@/types/ui-schema'

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

// ─── App type detection ──────────────────────────────────────────────────────

type AppType =
  | 'marketplace'
  | 'finance'
  | 'todo'
  | 'booking'
  | 'fitness'
  | 'learning'
  | 'schedule'
  | 'food'
  | 'community'
  | 'default'

const APP_TYPE_KEYWORDS: [string[], AppType][] = [
  [['중고', '장터', '중고거래', '마켓'], 'marketplace'],
  [['가계부', '지출', '예산', '저축', '수입지출'], 'finance'],
  [['할일', '할 일', '체크리스트', '루틴', '습관', '투두'], 'todo'],
  [['예약', '예약하기', '예약관리'], 'booking'],
  [['운동', '헬스', '피트니스', '다이어트'], 'fitness'],
  [['공부', '학습', '강의', '교육', '과제', '수업'], 'learning'],
  [['일정', '스케줄', '캘린더', '시간표'], 'schedule'],
  [['음식', '맛집', '배달', '식당', '카페', '레스토랑'], 'food'],
  [['커뮤니티', '게시판', '동네', '이웃', '주민', '소통'], 'community'],
]

export function detectAppType(plan: AppPlan): AppType {
  const text = [plan.rawDescription ?? plan.purpose, plan.appName, ...plan.coreFeatures].join(' ')

  for (const [keywords, appType] of APP_TYPE_KEYWORDS) {
    if (keywords.some((k) => text.includes(k))) return appType
  }
  return 'default'
}

const APP_TYPE_THEMES: Record<AppType, UITheme> = {
  marketplace: { primaryColor: '#10B981', style: 'minimal' },
  finance: { primaryColor: '#059669', style: 'minimal' },
  todo: { primaryColor: '#8B5CF6', style: 'minimal' },
  booking: { primaryColor: '#3B82F6', style: 'minimal' },
  fitness: { primaryColor: '#F97316', style: 'dark' },
  learning: { primaryColor: '#6366F1', style: 'minimal' },
  schedule: { primaryColor: '#0EA5E9', style: 'minimal' },
  food: { primaryColor: '#EF4444', style: 'colorful' },
  community: { primaryColor: '#F59E0B', style: 'minimal' },
  default: { primaryColor: '#4F46E5', style: 'minimal' },
}

type SectionBuilder = (plan: AppPlan) => UISection[]

const APP_TYPE_SECTION_BUILDERS: Record<AppType, SectionBuilder> = {
  marketplace: (plan) => [
    {
      type: 'Hero',
      title: `${plan.appName}에서 사고팔아요`,
      subtitle: plan.purpose,
      ctaText: '물건 보러가기',
    },
    {
      type: 'List',
      title: '최근 올라온 상품',
      items: [
        {
          title: '아이폰 13 Pro 128GB',
          subtitle: '상태: 최상',
          meta: '서울 강남구',
          badge: '판매중',
        },
        {
          title: '나이키 에어맥스 270',
          subtitle: '상태: 상',
          meta: '서울 마포구',
          badge: '판매중',
        },
        {
          title: '삼성 갤럭시북 노트북',
          subtitle: '상태: 중',
          meta: '경기 성남시',
          badge: '예약중',
        },
      ],
    },
    {
      type: 'Form',
      title: '상품 등록',
      fields: [
        {
          label: '상품명',
          type: 'text',
          placeholder: '판매할 물건 이름을 입력하세요',
          required: true,
        },
        { label: '가격', type: 'text', placeholder: '₩ 희망 가격', required: true },
        {
          label: '카테고리',
          type: 'select',
          options: ['전자기기', '의류/잡화', '가구/인테리어', '도서', '기타'],
        },
        {
          label: '상품 설명',
          type: 'textarea',
          placeholder: '상품 상태와 특이사항을 설명해주세요',
        },
      ],
      submitText: '등록하기',
    },
    {
      type: 'Chat',
      title: '판매자와 채팅',
      messages: [
        { sender: 'bot', text: '안녕하세요! 상품에 관심이 있으신가요?' },
        { sender: 'user', text: '네, 직거래 가능한가요?' },
        { sender: 'bot', text: '네, 강남역 근처에서 가능합니다.' },
      ],
      inputPlaceholder: '메시지를 입력하세요',
    },
  ],

  finance: (plan) => [
    {
      type: 'Hero',
      title: `${plan.appName}으로 지출을 관리해요`,
      subtitle: plan.purpose,
      ctaText: '기록하기',
    },
    {
      type: 'CardGrid',
      title: '이번 달 현황',
      cards: [
        { title: '총 지출', description: '₩ 850,000', badge: '이번달' },
        { title: '예산 잔액', description: '₩ 150,000', badge: '남은 예산' },
        { title: '최다 카테고리', description: '식비 45%', badge: 'TOP' },
      ],
    },
    {
      type: 'Form',
      title: '지출 입력',
      fields: [
        { label: '금액', type: 'text', placeholder: '₩ 지출 금액', required: true },
        {
          label: '카테고리',
          type: 'select',
          options: ['식비', '교통', '쇼핑', '의료', '문화', '기타'],
          required: true,
        },
        { label: '날짜', type: 'text', placeholder: 'YYYY-MM-DD', required: true },
        { label: '메모', type: 'textarea', placeholder: '어디에 썼나요?' },
      ],
      submitText: '저장하기',
    },
    {
      type: 'List',
      title: '최근 거래 내역',
      items: [
        { title: '스타벅스 아메리카노', subtitle: '식비', meta: '01/15', badge: '-5,500원' },
        { title: '지하철 정기권', subtitle: '교통', meta: '01/14', badge: '-55,000원' },
        { title: '마켓컬리', subtitle: '식비', meta: '01/13', badge: '-32,400원' },
      ],
    },
  ],

  todo: (plan) => [
    {
      type: 'Hero',
      title: `${plan.appName}으로 목표를 달성해요`,
      subtitle: plan.purpose,
      ctaText: '시작하기',
    },
    {
      type: 'CardGrid',
      title: '오늘의 현황',
      cards: [
        { title: '완료율', description: '3 / 5 달성', badge: '60%' },
        { title: '연속 달성', description: '7일째 지속 중', badge: '🔥' },
        { title: '이번 주', description: '5 / 7 완료', badge: 'GOOD' },
      ],
    },
    {
      type: 'List',
      title: '오늘 할 일',
      items: [
        { title: '아침 운동 30분', subtitle: '매일 반복', meta: '오전 7:00', badge: '완료' },
        { title: '책 읽기 20페이지', subtitle: '매일 반복', meta: '오전 8:00', badge: '진행중' },
        { title: '영어 단어 30개', subtitle: '평일 반복', meta: '오후 12:00', badge: '대기' },
      ],
    },
    {
      type: 'Form',
      title: '새 할 일 추가',
      fields: [
        { label: '제목', type: 'text', placeholder: '해야 할 일을 입력하세요', required: true },
        { label: '카테고리', type: 'select', options: ['건강', '학습', '업무', '취미', '기타'] },
        { label: '마감일', type: 'text', placeholder: 'YYYY-MM-DD' },
        { label: '매일 반복', type: 'toggle' },
      ],
      submitText: '추가하기',
    },
  ],

  booking: (plan) => [
    {
      type: 'Hero',
      title: `${plan.appName}으로 간편하게 예약하세요`,
      subtitle: plan.purpose,
      ctaText: '예약하기',
    },
    {
      type: 'List',
      title: '예약 가능한 항목',
      items: [
        { title: '오전 세션', subtitle: '09:00 ~ 12:00', meta: '잔여 3석', badge: '예약가능' },
        { title: '오후 세션', subtitle: '13:00 ~ 17:00', meta: '잔여 1석', badge: '마감임박' },
        { title: '저녁 세션', subtitle: '18:00 ~ 21:00', meta: '잔여 5석', badge: '예약가능' },
      ],
    },
    {
      type: 'Form',
      title: '예약 신청',
      fields: [
        { label: '날짜', type: 'text', placeholder: 'YYYY-MM-DD', required: true },
        {
          label: '시간',
          type: 'select',
          options: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
          required: true,
        },
        { label: '이름', type: 'text', placeholder: '예약자 이름', required: true },
        { label: '연락처', type: 'text', placeholder: '010-0000-0000', required: true },
        { label: '메모', type: 'textarea', placeholder: '특이사항이 있으면 알려주세요' },
      ],
      submitText: '예약하기',
    },
    {
      type: 'List',
      title: '내 예약 내역',
      items: [
        {
          title: '오전 세션 예약',
          subtitle: '2024.01.20 09:00',
          meta: '확인 완료',
          badge: '예약됨',
        },
        { title: '저녁 세션 예약', subtitle: '2024.01.18 18:00', meta: '이용 완료', badge: '완료' },
      ],
    },
  ],

  fitness: (plan) => [
    {
      type: 'Hero',
      title: `${plan.appName}으로 운동을 기록해요`,
      subtitle: plan.purpose,
      ctaText: '운동 시작',
    },
    {
      type: 'CardGrid',
      title: '이번 주 현황',
      cards: [
        { title: '운동 일수', description: '3일 / 5일 목표', badge: '60%' },
        { title: '총 운동 시간', description: '4시간 30분', badge: '이번주' },
        { title: '소모 칼로리', description: '1,850 kcal', badge: '🔥' },
      ],
    },
    {
      type: 'List',
      title: '최근 운동 기록',
      items: [
        { title: '벤치프레스', subtitle: '3세트 × 10회 · 60kg', meta: '오늘', badge: '완료' },
        { title: '스쿼트', subtitle: '4세트 × 12회 · 70kg', meta: '어제', badge: '완료' },
        { title: '러닝', subtitle: '5.2km · 32분', meta: '2일 전', badge: '완료' },
      ],
    },
    {
      type: 'Form',
      title: '운동 기록 추가',
      fields: [
        {
          label: '운동 종목',
          type: 'text',
          placeholder: '예: 벤치프레스, 스쿼트, 러닝',
          required: true,
        },
        { label: '세트 수', type: 'text', placeholder: '예: 3세트' },
        { label: '무게 / 횟수', type: 'text', placeholder: '예: 60kg × 10회' },
        { label: '메모', type: 'textarea', placeholder: '오늘 컨디션이나 특이사항을 남겨요' },
      ],
      submitText: '기록하기',
    },
  ],

  learning: (plan) => [
    {
      type: 'Hero',
      title: `${plan.appName}으로 성장해요`,
      subtitle: plan.purpose,
      ctaText: '학습 시작',
    },
    {
      type: 'CardGrid',
      title: '학습 현황',
      cards: [
        { title: '오늘 학습 시간', description: '2시간 15분', badge: '오늘' },
        { title: '완료 강의', description: '8 / 24개', badge: '33%' },
        { title: '연속 학습', description: '12일째', badge: '🎯' },
      ],
    },
    {
      type: 'List',
      title: '강의 목록',
      items: [
        {
          title: 'Chapter 3. 핵심 개념',
          subtitle: '진행률 65%',
          meta: '마지막 학습: 어제',
          badge: '진행중',
        },
        { title: 'Chapter 2. 기초 이론', subtitle: '완료', meta: '지난주', badge: '완료' },
        { title: 'Chapter 4. 실전 연습', subtitle: '진행률 0%', meta: '예정', badge: '대기' },
      ],
    },
    {
      type: 'Form',
      title: '학습 기록',
      fields: [
        {
          label: '과목 / 주제',
          type: 'text',
          placeholder: '예: 수학, 영어, 프로그래밍',
          required: true,
        },
        { label: '학습 내용', type: 'textarea', placeholder: '오늘 배운 내용을 요약해보세요' },
        { label: '학습 시간', type: 'text', placeholder: '예: 1시간 30분' },
        { label: '메모', type: 'textarea', placeholder: '이해가 안 되거나 다시 볼 내용' },
      ],
      submitText: '기록하기',
    },
  ],

  schedule: (plan) => [
    {
      type: 'Hero',
      title: `${plan.appName}으로 일정을 관리해요`,
      subtitle: plan.purpose,
      ctaText: '일정 보기',
    },
    {
      type: 'CardGrid',
      title: '일정 요약',
      cards: [
        { title: '오늘 일정', description: '3개 예정', badge: '오늘' },
        { title: '다음 일정', description: '오후 2:00 팀 미팅', badge: '곧' },
        { title: '이번 주', description: '7개 일정', badge: '전체' },
      ],
    },
    {
      type: 'List',
      title: '예정 일정',
      items: [
        { title: '팀 미팅', subtitle: '회의실 A · 오후 2:00', meta: '오늘', badge: 'D-Day' },
        { title: '병원 예약', subtitle: '강남 내과 · 오전 11:00', meta: '내일', badge: 'D-1' },
        { title: '생일 파티', subtitle: '강남역 카페 · 오후 6:00', meta: '01/20', badge: 'D-5' },
      ],
    },
    {
      type: 'Form',
      title: '일정 추가',
      fields: [
        { label: '제목', type: 'text', placeholder: '일정 이름을 입력하세요', required: true },
        { label: '날짜', type: 'text', placeholder: 'YYYY-MM-DD', required: true },
        { label: '시간', type: 'text', placeholder: '예: 14:00' },
        { label: '장소', type: 'text', placeholder: '장소를 입력하세요' },
        { label: '메모', type: 'textarea', placeholder: '추가 메모' },
      ],
      submitText: '저장하기',
    },
  ],

  food: (plan) => [
    {
      type: 'Hero',
      title: `${plan.appName}에서 맛집을 발견해요`,
      subtitle: plan.purpose,
      ctaText: '맛집 보기',
    },
    {
      type: 'CardGrid',
      title: '오늘의 추천',
      cards: [
        { title: '한식', description: '평점 4.8 · 32개 리뷰', badge: '추천' },
        { title: '일식', description: '평점 4.6 · 18개 리뷰', badge: '인기' },
        { title: '카페/디저트', description: '평점 4.7 · 45개 리뷰', badge: 'HOT' },
      ],
    },
    {
      type: 'List',
      title: '내 주변 맛집',
      items: [
        {
          title: '홍콩반점 강남점',
          subtitle: '중식 · 짬뽕, 짜장면',
          meta: '500m',
          badge: '⭐ 4.8',
        },
        { title: '스시 오마카세', subtitle: '일식 · 오마카세', meta: '1.2km', badge: '⭐ 4.6' },
        { title: '파리바게뜨', subtitle: '베이커리 · 빵, 케이크', meta: '300m', badge: '⭐ 4.3' },
      ],
    },
    {
      type: 'Form',
      title: '맛집 제보',
      fields: [
        { label: '가게 이름', type: 'text', placeholder: '맛집 이름을 입력하세요', required: true },
        { label: '주소', type: 'text', placeholder: '주소를 입력하세요', required: true },
        {
          label: '카테고리',
          type: 'select',
          options: ['한식', '중식', '일식', '양식', '카페', '기타'],
        },
        { label: '리뷰', type: 'textarea', placeholder: '맛, 분위기, 서비스를 알려주세요' },
      ],
      submitText: '등록하기',
    },
  ],

  community: (plan) => [
    {
      type: 'Hero',
      title: `${plan.appName}에서 이야기 나눠요`,
      subtitle: plan.purpose,
      ctaText: '게시글 보기',
    },
    {
      type: 'CardGrid',
      title: '인기글',
      cards: [
        { title: '우리 동네 맛집 추천', description: '좋아요 24 · 댓글 8', badge: 'HOT' },
        { title: '중고 나눔합니다', description: '좋아요 18 · 댓글 12', badge: '나눔' },
        { title: '주민센터 행사 안내', description: '좋아요 31 · 댓글 3', badge: '공지' },
      ],
    },
    {
      type: 'List',
      title: '최신 게시글',
      items: [
        { title: '강아지 찾아요', subtitle: '홍길동 · 30분 전', meta: '조회 142', badge: '긴급' },
        {
          title: '주차 관련 건의사항',
          subtitle: '이영희 · 2시간 전',
          meta: '조회 89',
          badge: 'NEW',
        },
        { title: '오늘 날씨 너무 좋죠?', subtitle: '김철수 · 어제', meta: '조회 234' },
      ],
    },
    {
      type: 'Form',
      title: '글 작성',
      fields: [
        { label: '제목', type: 'text', placeholder: '제목을 입력하세요', required: true },
        {
          label: '내용',
          type: 'textarea',
          placeholder: '이웃들과 나누고 싶은 이야기를 적어주세요',
          required: true,
        },
        { label: '카테고리', type: 'select', options: ['자유', '정보', '나눔', '질문', '공지'] },
        { label: '익명으로 올리기', type: 'toggle' },
      ],
      submitText: '올리기',
    },
  ],

  default: (plan) => {
    const features = plan.coreFeatures.slice(0, 4)
    const cards =
      features.length > 0
        ? features.map((f) => ({ title: f, description: `${plan.appName}의 핵심 기능입니다.` }))
        : [
            { title: '기능 1', description: '주요 기능을 소개합니다.' },
            { title: '기능 2', description: '편리한 기능을 제공합니다.' },
          ]
    return [
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
    ]
  },
}

// ─── App schema generation ────────────────────────────────────────────────────

export function generateApp(plan: AppPlan): UISchema {
  const appType = detectAppType(plan)
  return {
    appName: plan.appName,
    theme: APP_TYPE_THEMES[appType],
    sections: APP_TYPE_SECTION_BUILDERS[appType](plan),
  }
}

function buildTechDescriptions(
  techStack: string[],
  coreFeatures: string[]
): Record<string, string> {
  const result: Record<string, string> = {}
  const top2 = coreFeatures.slice(0, 2).join(', ')

  for (const tech of techStack) {
    const t = tech.toLowerCase()

    if (
      t.includes('react native') ||
      t.includes('flutter') ||
      t.includes('swift') ||
      t.includes('kotlin')
    ) {
      result[tech] = `모바일 앱 화면 구현에 사용 (${top2})`
    } else if (t.includes('next') || t.includes('nuxt')) {
      result[tech] = `웹 앱 화면 구성에 사용 (${top2} 화면 구현)`
    } else if (
      t.includes('react') ||
      t.includes('vue') ||
      t.includes('angular') ||
      t.includes('svelte')
    ) {
      result[tech] = `앱 화면 구현에 사용 (${top2})`
    } else if (
      t.includes('node') ||
      t.includes('express') ||
      t.includes('fastapi') ||
      t.includes('django') ||
      t.includes('spring') ||
      t.includes('flask')
    ) {
      const serverFeatures = coreFeatures.filter((f) =>
        ['로그인', '회원', '인증', '검색', '알림', '결제', '저장', '관리'].some((k) =>
          f.includes(k)
        )
      )
      const featList = (serverFeatures.length > 0 ? serverFeatures : coreFeatures)
        .slice(0, 2)
        .join(', ')
      result[tech] = `서버 기능 구현에 사용 (${featList})`
    } else if (
      ['mongodb', 'postgresql', 'mysql', 'sqlite', 'mariadb'].some((db) => t.includes(db))
    ) {
      result[tech] = `데이터 저장·관리에 사용 (${top2} 데이터 보관)`
    } else if (t.includes('firebase') || t.includes('supabase')) {
      result[tech] = `로그인·DB·스토리지 통합 제공 (${top2} 기능 지원)`
    } else if (t.includes('redis')) {
      result[tech] = `로그인 세션 유지 및 빠른 데이터 캐싱에 사용`
    } else if (t.includes('tailwind') || t.includes('css')) {
      result[tech] = `모든 화면의 디자인·스타일링에 사용`
    } else if (t.includes('typescript') || t.includes('javascript')) {
      result[tech] = `전체 앱 개발 기본 언어로 사용`
    } else {
      result[tech] = `${top2} 구현에 활용`
    }
  }

  return result
}

export function generatePlan(project: Project): AppPlan {
  const desc = project.input.description
  const answers: Record<string, string> = {}
  project.qa.questions.forEach((q) => {
    answers[q.id] = q.answer
  })

  const combined = desc + ' ' + Object.values(answers).join(' ')
  const coreFeatures = extractFeatures(combined)
  const techStack = ['React', 'Next.js', 'Tailwind CSS']

  return {
    appName: generateAppName(desc),
    purpose: desc.length > 80 ? desc.slice(0, 80).trimEnd() + '…' : desc,
    targetUser: answers['q1'] || '일반 사용자',
    coreFeatures,
    techStack,
    techDescriptions: buildTechDescriptions(techStack, coreFeatures),
    rawDescription: desc,
  }
}
