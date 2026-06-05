# MyWebAppBuilder

자연어로 앱을 설명하면 기획서와 와이어프레임을 자동으로 생성해주는 웹 앱 빌더입니다.

**배포 URL:** https://my-web-app-builder.vercel.app/

---

## 데모 확인 방법

https://my-web-app-builder.vercel.app/ 에 접속해 아래 순서로 체험할 수 있습니다.

1. "새 앱 만들기" 클릭
2. 앱 설명 입력 (예: `우리 동네 주민들이 중고 물건을 사고팔 수 있는 앱을 만들고 싶어요`)
3. 맞춤 질문 5개에 답변 입력
4. 기획서 자동 생성 확인 (앱 이름, 핵심 기능, 기술 스택)
5. 화면 목록에서 각 화면 클릭 → 와이어프레임 미리보기
6. 새로고침 후 데이터가 유지되는지 확인

### 배포 후 확인 체크리스트

- [ ] 홈 화면 정상 로딩
- [ ] "새 앱 만들기" → 입력 → 질문 → 기획서 전체 흐름 동작
- [ ] 빈 답변 validation 에러 배너 노출
- [ ] 기획서 인라인 편집 및 재생성 동작
- [ ] 화면 목록 → 와이어프레임 미리보기 진입
- [ ] 새로고침 후 localStorage 데이터 유지
- [ ] 프로젝트 삭제 후 목록에서 제거
- [ ] 모바일 뷰(375px) 레이아웃 깨짐 없음

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 앱 설명 입력 | 만들고 싶은 앱을 자유롭게 서술 |
| 맞춤 질문 생성 | 앱 설명의 도메인(중고거래, 맛집, 운동 등)을 감지해 관련 질문 제시 |
| 기획서 자동 생성 | 앱 이름·목적·타겟 유저·핵심 기능·기술 스택 생성, 인라인 편집 가능 |
| 화면 목록 생성 | 기획서 핵심 기능 기반으로 화면 목록 자동 구성 |
| 와이어프레임 미리보기 | 각 화면을 모바일 프레임 + 8종 UI 블록으로 시각화 |
| 프로젝트 저장 | localStorage에 자동 저장, 새로고침 후에도 데이터 유지 |
| 프로젝트 삭제 | 홈 화면에서 개별 프로젝트 삭제 가능 |

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| UI 라이브러리 | React 19 |
| 스타일링 | Tailwind CSS v4 |
| 언어 | TypeScript 5 |
| 상태/저장 | localStorage (클라이언트 전용) |
| AI | mock-ai (현재 단계, 실제 API 미연동) |
| 린터/포맷터 | ESLint 9, Prettier 3 |

---

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 http://localhost:3000 접속

```bash
# 프로덕션 빌드 확인
npm run build

# 빌드 결과 실행
npm run start
```

---

## 테스트 방법

현재 자동화 테스트는 미구성 상태이며, 수동 테스트로 전체 흐름을 검증합니다.

### 빌드 검증

```bash
npx tsc --noEmit    # TypeScript 오류 0개
npx eslint src      # ESLint 오류 0개
npm run build       # 빌드 성공
```

### 수동 E2E 테스트 시나리오

#### 시나리오 1: 중고거래 앱

1. 홈에서 "새 앱 만들기" 클릭
2. 앱 설명 입력: `우리 동네 주민들이 중고 물건을 사고팔 수 있는 앱을 만들고 싶어요`
3. 질문 화면에서 placeholder가 중고거래 관련 예시인지 확인
4. 빈 항목 있는 채로 "기획서 생성" 클릭 → 에러 배너 노출 확인
5. 모든 항목 답변 후 기획서 생성 → 앱 이름이 `동네마켓` 또는 유사하게 생성되는지 확인
6. 화면 목록에서 NavBar 탭이 실제 화면 이름인지 확인
7. 새로고침 후 데이터 유지 확인
8. 홈에서 프로젝트 삭제 후 목록에서 제거 확인

#### 시나리오 2: 운동 기록 앱

1. 앱 설명: `매일 운동한 내용을 기록하고 주간 통계와 목표 달성을 확인하고 싶어요`
2. 질문 placeholder가 운동 관련인지 확인
3. 기획서 앱 이름이 `운동기록` 또는 유사하게 생성되는지 확인

#### 시나리오 3: 맛집 추천 앱

1. 앱 설명: `맛집을 저장하고 친구들과 공유할 수 있는 앱을 만들고 싶어요`
2. 질문 placeholder가 음식/맛집 관련인지 확인
3. 기획서 앱 이름이 `맛집공유` 또는 유사하게 생성되는지 확인

---

## MVP 구현 범위 (Phase 0–6 완료)

| Phase | 내용 |
|-------|------|
| Phase 0 | Next.js 16 + TypeScript + Tailwind v4 환경 구성, 폴더 구조, Prettier 설정 |
| Phase 1 | 타입 정의, localStorage CRUD, 프로젝트 훅, 홈 화면 |
| Phase 2 | 앱 설명 입력 화면, 질문 화면, StepIndicator |
| Phase 3 | mock-ai 기반 기획서 생성(`generatePlan`), PlanViewer, 인라인 편집, 재생성 |
| Phase 4 | 화면 목록 자동 생성(`generateScreens`), ScreenCard |
| Phase 5 | 와이어프레임 8종 블록, MobileFrame, WireframeRenderer |
| Phase 6 | 프로젝트 상세 페이지, 진행 체크리스트, 통계 카드 |
| 안정화 | ESLint/TS 오류 0, 빌드 통과, 로직 버그 수정 |
| UX 개선 | 질문 도메인 감지, 빈 답변 validation, NavBar 탭 개선 |
| 앱 이름 개선 | `generateAppName()` 키워드 규칙 테이블 기반 생성 |

### 라우트 구조

```
/                                  홈 — 프로젝트 목록
/projects/[id]                     프로젝트 상세 — 진행 상태 체크리스트
/projects/[id]/input               앱 설명 입력
/projects/[id]/questions           맞춤 질문 답변
/projects/[id]/plan                기획서 보기 및 편집
/projects/[id]/screens             화면 목록
/projects/[id]/screens/[screenId]  와이어프레임 미리보기
```

---

## localStorage 저장 구조

모든 데이터는 키 `mwab_projects`에 JSON 배열로 저장됩니다.

```ts
// localStorage key: "mwab_projects"
Project[] = [
  {
    id: string,           // UUID (예: "a1b2c3d4-...")
    createdAt: string,    // ISO 8601 (예: "2026-06-05T12:00:00.000Z")
    updatedAt: string,    // ISO 8601
    status: "draft" | "planned" | "complete",

    input: {
      description: string  // 사용자가 입력한 앱 설명
    },

    qa: {
      questions: [
        {
          id: string,
          text: string,        // 질문 텍스트
          answer: string,      // 사용자 답변
          placeholder?: string
        }
      ]
    },

    plan: {
      appName: string,          // 생성된 앱 이름 (예: "동네마켓")
      purpose: string,          // 앱 목적
      targetUser: string,       // 타겟 유저
      coreFeatures: string[],   // 핵심 기능 목록
      techStack: string[]       // 기술 스택 목록
    },

    screens: [
      {
        id: string,
        name: string,           // 화면 이름 (예: "홈", "상품 목록")
        description: string,
        components: [
          {
            type: "header" | "nav" | "list" | "card" | "form" | "button" | "text" | "image-placeholder",
            label: string,
            props?: Record<string, string>
          }
        ]
      }
    ]
  }
]
```

---

## 현재 상태: Mock AI 기반

현재 기획서·질문·화면 생성은 모두 `src/lib/mock-ai.ts`의 규칙 기반 로직으로 동작합니다.
실제 AI API를 호출하지 않으며 네트워크 요청이 없습니다.

```
src/lib/mock-ai.ts
├── generateAppName(description)    키워드 매칭으로 앱 이름 생성
├── generateQuestions(description)  도메인 감지 후 맞춤 질문 5개 생성
├── generatePlan(input, qa)         기획서 객체 반환
└── generateScreens(plan)           핵심 기능 기반 화면 목록 반환
```

---

## 다음 단계

### 1. 실제 AI API 연동

`src/lib/mock-ai.ts` 함수들을 Claude API 호출로 교체할 예정입니다.

```
예정 모델: claude-haiku-4-5 (비용 효율적)
대상 함수: generatePlan, generateQuestions, generateAppName
환경 변수: ANTHROPIC_API_KEY
```

### 2. Vercel 배포 (완료)

배포 URL: https://my-web-app-builder.vercel.app/

AI 연동 후 환경 변수 추가 필요:
```
Vercel 대시보드 → Settings → Environment Variables → ANTHROPIC_API_KEY
```

### 3. 자동화 테스트 추가

- 단위 테스트: `generateAppName`, `generateQuestions`, `storage.ts`
- E2E 테스트: Playwright로 전체 사용자 흐름 자동화

---

## 알려진 제한사항

- `generateQuestions()` 도메인 감지가 첫 번째 매칭에만 반응 (복합 도메인 미지원)
- 화면 생성이 기획서 `coreFeatures` 키워드에 의존 — 자유 입력 설명과 불일치 가능
- `useEffect` 내 직접 `setState` 패턴으로 ESLint `eslint-disable` 주석 4곳 존재
