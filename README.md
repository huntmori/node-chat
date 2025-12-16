# TypeScript Node.js Server with MariaDB

채팅 서버를 위한 TypeScript Node.js 프로젝트입니다.

## 기술 스택

- Node.js
- TypeScript
- Express
- MariaDB (mysql2)
- dotenv

## 프로젝트 구조

```
node-chat/
├── src/
│   ├── config/
│   │   └── database.ts       # 데이터베이스 연결 설정
│   ├── controllers/          # 컨트롤러
│   ├── models/              # 데이터 모델
│   ├── routes/              # 라우트
│   └── index.ts.old             # 서버 진입점
├── database/
│   └── schema.sql           # 데이터베이스 스키마
├── .env                     # 환경 변수 (개발용)
├── .env.example             # 환경 변수 예시
├── package.json
└── tsconfig.json
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 수정하여 MariaDB 연결 정보를 설정하세요:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=node_chat
DB_PORT=3306
```

### 3. 데이터베이스 설정

MariaDB에 접속하여 스키마를 생성하세요:

```bash
mysql -u root -p < database/schema.sql
```

또는 MariaDB 클라이언트에서 직접 실행:

```sql
source database/schema.sql
```

### 4. 서버 실행

개발 모드 (자동 재시작):
```bash
npm run dev
```

프로덕션 빌드:
```bash
npm run build
npm start
```

## API 엔드포인트

- `GET /` - 서버 정보
- `GET /health` - 헬스 체크

## 개발

TypeScript 파일 감시:
```bash
npm run watch
```

## 라이선스

ISC
