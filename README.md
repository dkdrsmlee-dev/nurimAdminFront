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
  app/                  # 앱 엔트리/화면 전환
  pages/                # 페이지 컨테이너
  features/             # 도메인별 UI/모델
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

## 참고

- 인증/권한/실데이터 API 연동은 이후 단계에서 추가 예정입니다.
