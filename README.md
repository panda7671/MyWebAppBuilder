# MyWebAppBuilder

자연어로 앱을 설명하면 기획서·화면 목록·앱 미리보기·React 컴포넌트 코드까지 자동으로 생성해주는 웹 앱 빌더입니다.

**배포 URL:** https://my-web-app-builder.vercel.app/

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 앱 설명 입력 | 만들고 싶은 앱을 자유 텍스트로 설명 |
| 맞춤 질문 생성 | 도메인(중고거래·맛집·운동 등)을 감지해 관련 질문 5개 제시 |
| 기획서 자동 생성 | 앱 이름·목적·타겟 유저·핵심 기능·기술 스택 생성, 인라인 편집 가능 |
| 화면 목록 생성 | 기획서 핵심 기능 기반으로 화면 목록 자동 구성 |
| 와이어프레임 미리보기 | 각 화면을 모바일 프레임 + 8종 UI 블록으로 시각화 |
| 앱 미리보기 (인터랙티브) | UISchema 기반 모바일형 미리보기 — 버튼 클릭·폼 입력·카드 선택·채팅 가능 |
| 코드 보기 | UISchema를 React TSX 컴포넌트 코드 문자열로 deterministic 변환 (AI 재호출 없음) |
| TSX 파일 다운로드 | 생성된 컴포넌트를 `앱이름.tsx` 파일로 브라우저 다운로드 |
| 프로젝트 저장 | localStorage에 자동 저장, 새로고침 후에도 데이터 유지 |
| 사용량 제한 | 하루 10회 AI 생성 제한 (localStorage 기반) |

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| UI 라이브러리 | React 19 |
| 스타일링 | Tailwind CSS v4 |
| 언어 | TypeScript 5 |
| AI | Claude API (`claude-haiku-4-5`) — 없으면 mock-ai fallback |
| 상태/저장 | localStorage (클라이언트 전용) |
| 배포 | Vercel |

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
npm run start
```

---

## 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 아래 키를 추가합니다.

```
ANTHROPIC_API_KEY=your_key_here
```

- 키가 없거나 API 호출이 실패하면 자동으로 **mock-ai fallback**으로 전환됩니다.
- `.env.local`은 `.gitignore`에 포함되어 있어 저장소에 커밋되지 않습니다.

### Vercel 배포 시 환경변수 등록

```
Vercel 대시보드 → 프로젝트 Settings → Environment Variables
→ ANTHROPIC_API_KEY = [실제 키 입력]
→ 저장 후 Redeploy
```

---

## 사용량 제한

- **하루 10회** AI 생성 제한이 적용됩니다.
- 제한 카운트는 브라우저 `localStorage`에 날짜와 함께 저장됩니다.
- 자정이 지나면 자동으로 초기화됩니다.

> **주의:** localStorage 기반 제한은 브라우저 데이터를 삭제하면 우회할 수 있습니다.
> 현재는 비용 인식 목적의 소프트 제한이며, 서버 기반 rate limit은 미구현 상태입니다.

---

## 보안 및 비용 주의사항

- `ANTHROPIC_API_KEY`는 서버 환경변수로만 사용하며 클라이언트 코드에 노출되지 않습니다.
- AI 호출은 `/api/generate` 서버 API Route에서만 실행됩니다.
- 사용량 제한이 localStorage 기반이므로 실제 API 비용 제어를 위해서는 서버 기반 rate limit이 필요합니다.
- 실제 서비스 운영 시 Anthropic 콘솔에서 지출 한도(Spend Limit)를 별도로 설정할 것을 권장합니다.

---

## 생성 코드 다운로드 안내

"코드 보기" → "다운로드" 버튼으로 앱 이름 기반의 `.tsx` 파일을 받을 수 있습니다.

**중요:** 다운로드한 파일은 단독 실행 파일이 아닙니다.

```
# 올바른 사용법
react + typescript 의존성이 있는 프로젝트에 복사해야 합니다.

예시 경로: src/components/GeneratedApp.tsx
```

VS Code에서 단독으로 열면 `import React from 'react'`에 빨간 줄이 표시되는데,
이는 코드 오류가 아니라 프로젝트 컨텍스트 없이 열었기 때문입니다.

---

## 라우트 구조

```
/                                  홈 — 프로젝트 목록
/projects/[id]                     프로젝트 상세 — 진행 상태 체크리스트
/projects/[id]/input               앱 설명 입력
/projects/[id]/questions           맞춤 질문 답변
/projects/[id]/plan                기획서 보기 및 편집
/projects/[id]/screens             화면 목록
/projects/[id]/screens/[screenId]  와이어프레임 미리보기
/projects/[id]/preview             앱 미리보기 + 코드 보기 + TSX 다운로드
```

---

## 현재 한계

| 항목 | 내용 |
|------|------|
| 사용량 제한 우회 | localStorage 기반이라 브라우저 데이터 삭제 시 초기화됨 |
| 다운로드 파일 | `.tsx` 단일 파일만 제공 — `package.json`·`tsconfig.json` 등 프로젝트 구조 미포함 |
| ZIP 다운로드 | 미구현 |
| 서버 기반 rate limit | 미구현 |
| 로그인/계정 | 미구현 — 데이터가 브라우저 로컬에만 저장됨 |
| 생성 코드 품질 | UISchema 변환 기반 고정 템플릿 — 복잡한 비즈니스 로직 미지원 |

---

## 다음 계획

- [ ] **ZIP 다운로드** — `package.json`, `tsconfig.json`, `next.config.js` 포함 전체 프로젝트 구조 제공
- [ ] **서버 기반 rate limit** — IP 또는 세션 기반으로 서버에서 사용량 제한
- [ ] **로그인 / DB 저장** — 계정 연동 및 서버 데이터 영속화
- [ ] **생성 코드 품질 개선** — 더 다양한 섹션 타입 및 실제 비즈니스 로직 템플릿 지원

---

## 빌드 검증

```bash
npx tsc --noEmit    # TypeScript 오류 0개
npm run build       # 빌드 성공
```
