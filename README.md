# nurimAdminFront

`nurimAppDemo`의 관리자 페이지 프론트엔드 프로젝트입니다.  
현재는 로그인 화면과 대시보드 기본 셸(좌측 트리 메뉴)까지 구현된 상태입니다.

## 기술 스택

- React 19
- TypeScript
- Vite
- ESLint

## 개발 원칙

- PC 전용 화면 기준으로 개발합니다. (모바일 버전 미지원)
- 퍼블리싱(UI)과 프론트 로직을 분리해 병렬 작업 가능 구조를 유지합니다.
  - UI: `shared/ui`, `features/*/ui`
  - 로직: `features/*/model`, `pages/*`, `app/*`

## 프로젝트 구조

```txt
src/
  app/                  # 앱 엔트리/화면 라우팅
  pages/                # 페이지 컨테이너
  features/             # 도메인별 UI/모델/훅
  shared/
    styles/             # 전역 스타일/토큰
    ui/                 # 공용 UI 컴포넌트
```

## 실행 방법

```bash
npm install
npm run dev
```

- 기본 접속 주소: `http://localhost:5173`
  - 로그인: `http://localhost:5173/login`
  - 대시보드: `http://localhost:5173/dashboard`
  - UI 프리뷰: `http://localhost:5173/ui-preview`

## 라우팅/배포 전략

- 현재 라우팅은 `Path 기반` (`/login`, `/dashboard`, `/ui-preview`)입니다.
- 운영 서버에서는 새로고침/직접 URL 접속 시 404가 나지 않도록 `index.html fallback`이 반드시 필요합니다.
- 이 저장소는 Nginx fallback 설정 파일을 포함합니다.
  - `deploy/nginx/default.conf`
  - 핵심 설정: `try_files $uri $uri/ /index.html;`

## Docker 실행 (Nginx fallback 포함)

```bash
docker build -t nurim-admin-front .
docker run --rm -p 8080:80 nurim-admin-front
```

- 접속 주소: `http://localhost:8080`
- 위 컨테이너는 빌드 결과물(`dist`)을 Nginx로 서빙하며 SPA fallback이 적용됩니다.

## 주요 스크립트

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
npm run preview  # 빌드 결과 미리보기
```

## 현재 구현 범위

- 로그인 페이지
  - 백엔드 연동 없이 로그인 버튼 클릭 시 대시보드로 이동
- 대시보드 페이지
  - 좌측 트리 메뉴
  - 메뉴 항목 접기/펼치기
  - 사이드바 너비 드래그 리사이즈 (최소 220px ~ 최대 520px)
- UI Preview 페이지
  - 로그인/사이드바 UI를 앱 로직과 분리해 확인 가능한 퍼블리싱 전용 화면

## 사이드바 너비 값 관리 규칙

- 실제 동작 제한값은 `src/features/layout/model/sidebarSize.ts`를 기준으로 관리합니다.
- CSS 표현 토큰은 `src/shared/styles/tokens.css`의 아래 값을 사용합니다.
  - `--size-sidebar-min`
  - `--size-sidebar-default`
  - `--size-sidebar-max`
- 사이드바 너비 변경 시 위 두 파일을 같은 PR/커밋에서 함께 수정해 항상 동일하게 유지합니다.

## 참고

- 인증/권한/실데이터 API 연동은 이후 단계에서 추가 예정입니다.
