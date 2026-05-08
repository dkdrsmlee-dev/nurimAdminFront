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

### 로그인 API 연동 설정

로그인 화면은 아래 API를 호출합니다.

- `POST /api/v1/admin/auth/login`
- 요청 바디: `{ "adminId": "...", "password": "..." }`

기본값은 same-origin 호출이며, 백엔드 도메인이 다르면 `.env`에 base URL을 지정합니다.

```bash
VITE_API_BASE_URL=http://localhost:3000
```

개발 서버(`localhost:5173`)에서 CORS 없이 바로 붙이려면 Vite 프록시를 사용합니다.

```bash
VITE_API_PROXY_TARGET=http://192.168.0.147:4011
```

- 위 값을 설정하면 `/api/*` 요청이 해당 백엔드로 프록시됩니다.

### RBAC 메뉴 권한 연동

대시보드 좌측 메뉴는 정적 하드코딩 목록이 아니라, 로그인 사용자 Role 기반 권한 트리로 렌더링됩니다.

- `GET /api/v1/admin/rbac/roles`
- `GET /api/v1/admin/rbac/roles/{roleId}/permission-tree`
- 각 메뉴의 `permission.canRead` 값을 기준으로 노출 여부를 결정합니다.
- 여러 Role이 존재하면 메뉴 권한(`canCreate/read/update/delete`)을 OR 병합합니다.

참고:

- 현재 백엔드는 `Authorization: Bearer <token>` 헤더 기준으로 정상 동작합니다.
- 문서상 `access-token` 보안 스킴이 있어도, 프론트는 호환을 위해 두 헤더를 모두 전송합니다.

## 라우팅/배포 전략

- 현재 라우팅은 `Path 기반` (`/login`, `/dashboard`, `/ui-preview`)입니다.
- 운영 서버에서는 새로고침/직접 URL 접속 시 404가 나지 않도록 `index.html fallback`이 반드시 필요합니다.
- 이 저장소는 Nginx fallback 설정 파일을 포함합니다.
  - `deploy/nginx/default.conf`
  - 핵심 설정: `try_files $uri $uri/ /index.html;`
  - API 프록시: `/api/*` 요청을 `http://192.168.0.147:4011`로 전달

## Docker 실행 (Nginx fallback 포함)

```bash
docker build -t nurim-admin-front .
docker run --rm -p 8080:80 nurim-admin-front
```

- 접속 주소: `http://localhost:8080`
- 위 컨테이너는 빌드 결과물(`dist`)을 Nginx로 서빙하며 SPA fallback이 적용됩니다.
- 컨테이너 내부 Nginx가 `/api/*`를 `http://192.168.0.147:4011`으로 프록시합니다.

## Jenkins 자동 배포 (147 서버)

앱 웹프론트와 동일하게 GitHub main 변경 감지(`Poll SCM`) 후 Docker 재배포 방식으로 운영할 수 있습니다.

```text
GitHub main push
→ Jenkins checkout
→ docker build
→ 기존 nurim-admin-front 컨테이너 종료/삭제
→ 신규 컨테이너 실행
→ http://192.168.0.147:3001 반영
```

Jenkins Pipeline Job 설정:

```text
Definition: Pipeline script from SCM
SCM: Git
Repository URL: https://github.com/dkdrsmlee-dev/nurimAdminFront.git
Branch: main
Script Path: Jenkinsfile
```

권장 트리거:

```text
Build Triggers: Poll SCM
Schedule: H/1 * * * *
```

파이프라인은 저장소 루트의 `Jenkinsfile`을 사용하며 기본 배포 포트는 `3001`입니다.
(`FRONT_HOST_PORT` 변경 시 포트 조정 가능)

수동 배포 확인 명령:

```bash
docker build -t nurim-admin-front:latest -f Dockerfile .
docker rm -f nurim-admin-front 2>/dev/null || true
docker run -d --name nurim-admin-front --restart unless-stopped -p 3001:80 nurim-admin-front:latest
```

## 주요 스크립트

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
npm run preview  # 빌드 결과 미리보기
```

## 현재 구현 범위

- 로그인 페이지
  - `POST /api/v1/admin/auth/login` 백엔드 연동
  - 로그인 성공 시 access/refresh 토큰 세션 저장(localStorage)
  - 만료/401 발생 시 `POST /api/v1/auth/refresh` 자동 재발급 후 보호 API 1회 재시도
- 대시보드 페이지
  - 좌측 트리 메뉴 (RBAC 권한 트리 기반 동적 렌더링)
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

- 상세 페이지 라우팅/권한별 버튼 제어(`canCreate/update/delete`)는 다음 단계에서 확장 예정입니다.
