# 설치 및 설정 가이드

## 사전 준비사항

1. **Node.js** 18.x 이상
2. **Firebase** 계정
3. **Google Cloud** 계정 (Vision API)
4. **Replicate** 계정 (AI 이미지 생성)

## 단계별 설정

### 1. Firebase 설정

#### 1.1 프로젝트 생성
1. https://console.firebase.google.com/ 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: winter-style-analyzer)
4. Google Analytics 활성화 (선택사항)

#### 1.2 웹 앱 추가
1. 프로젝트 설정 > 일반 탭
2. "앱 추가" > 웹 아이콘 클릭
3. 앱 닉네임 입력
4. Firebase SDK 구성 정보 복사

#### 1.3 Storage 활성화
1. Build > Storage 메뉴
2. "시작하기" 클릭
3. 테스트 모드로 시작
4. 위치 선택 (asia-northeast3 권장)

#### 1.4 Firestore 활성화
1. Build > Firestore Database 메뉴
2. "데이터베이스 만들기" 클릭
3. 테스트 모드로 시작
4. 위치 선택 (asia-northeast3 권장)

### 2. Google Cloud Vision API 설정

#### 2.1 프로젝트 설정
1. https://console.cloud.google.com/ 접속
2. Firebase 프로젝트와 동일한 프로젝트 선택
3. "API 및 서비스" > "라이브러리" 메뉴

#### 2.2 Vision API 활성화
1. "Cloud Vision API" 검색
2. "사용 설정" 클릭

#### 2.3 서비스 계정 생성
1. "API 및 서비스" > "사용자 인증 정보"
2. "사용자 인증 정보 만들기" > "서비스 계정"
3. 서비스 계정 이름 입력 (예: vision-api-service)
4. 역할: "Cloud Vision API 사용자" 선택
5. "완료" 클릭

#### 2.4 키 생성
1. 생성된 서비스 계정 클릭
2. "키" 탭 > "키 추가" > "새 키 만들기"
3. JSON 형식 선택
4. 다운로드된 JSON 파일을 프로젝트 루트에 저장
5. 파일명: `google-credentials.json` (gitignore에 포함됨)

### 3. Replicate API 설정

#### 3.1 계정 생성
1. https://replicate.com/ 접속
2. 계정 생성 또는 로그인

#### 3.2 API 토큰 발급
1. 프로필 > API Tokens 메뉴
2. "Create Token" 클릭
3. 토큰 복사

### 4. 환경 변수 설정

`.env.local` 파일 생성:

```bash
# Firebase (웹 앱 설정에서 복사)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Google Cloud Vision
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# Replicate
REPLICATE_API_TOKEN=r8_abc123...
```

### 5. Firebase Rules 배포

#### 5.1 Firebase CLI 설치
```bash
npm install -g firebase-tools
```

#### 5.2 로그인
```bash
firebase login
```

#### 5.3 프로젝트 초기화
```bash
firebase init
```

- Firestore, Storage 선택
- 기존 프로젝트 선택
- 기본 설정 그대로 진행

#### 5.4 Rules 배포
```bash
firebase deploy --only storage,firestore
```

### 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 트러블슈팅

### Vision API 오류
- `GOOGLE_APPLICATION_CREDENTIALS` 경로 확인
- 서비스 계정에 Vision API 권한 있는지 확인
- 프로젝트에 청구 계정 연결되어 있는지 확인

### Replicate 오류
- API 토큰이 올바른지 확인
- 계정에 충분한 크레딧이 있는지 확인

### Firebase Storage 오류
- Storage Rules가 올바르게 배포되었는지 확인
- 파일 크기 제한 확인 (10MB)

## 비용 예상

### Google Cloud Vision API
- 처음 1,000개 이미지/월: 무료
- 이후: $1.50/1,000 이미지

### Replicate
- 모델별 상이
- SDXL: ~$0.003/이미지
- Anime 모델: ~$0.01/이미지

### Firebase
- Spark (무료) 플랜:
  - Storage: 5GB
  - Firestore: 1GB
  - 대부분의 개발/테스트 용도로 충분

## 다음 단계

1. 테스트 이미지로 4가지 스타일 모두 테스트
2. 분류 알고리즘 정확도 확인 및 조정
3. 이미지 생성 품질 및 시간 확인
4. 프로덕션 배포 (Vercel 권장)
