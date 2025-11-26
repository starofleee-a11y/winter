# 빠른 시작 가이드

## 최소 설정으로 바로 테스트하기

### 1. 환경 변수 설정 (.env.local)

```bash
# 이것만 있으면 기본 기능 작동!
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc

# 선택사항 (나중에 추가 가능)
# GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
# REPLICATE_API_TOKEN=r8_...
```

### 2. Firebase 설정 (5분)

1. https://console.firebase.google.com/ 접속
2. 프로젝트 생성
3. 웹 앱 추가 → Config 복사 → .env.local에 붙여넣기
4. Storage 활성화

### 3. 실행

```bash
npm run dev
```

http://localhost:3000 접속하면 바로 사용 가능!

## 작동 방식

### 현재 상태 (Vision/Replicate API 없을 때)
- ✅ 이미지 업로드
- ✅ 색상 추출 및 분석 (k-means 알고리즘)
- ✅ 4가지 스타일 자동 분류
- ✅ 결과 페이지 표시
- ⚠️ Vision API 호출 실패 → 색상 기반 분석으로 대체
- ⚠️ AI 아트 변환 진행 중 표시 (실제로는 생성 안됨)

### Google Vision API 추가하면
- 옷 스타일, 메이크업, 악세서리 자동 인식
- 분류 정확도 향상

### Replicate API 추가하면
- AI 아트 변환 실제 작동

## 나중에 API 추가하는 법

### Google Vision API
1. `.env.local`에 추가:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
   ```
2. 서비스 계정 키 파일 다운로드
3. 프로젝트 루트에 `google-credentials.json` 저장
4. 재시작

### Replicate API
1. https://replicate.com/ 가입
2. API 토큰 발급
3. `.env.local`에 추가:
   ```
   REPLICATE_API_TOKEN=r8_your_token
   ```
4. 재시작

## 트러블슈팅

### Vision API 에러 뜨면?
→ 정상입니다! 색상 분석만으로도 작동합니다.

### 이미지 변환이 안되면?
→ Replicate API 토큰이 없어서 그렇습니다. 분류는 정상 작동합니다.

### Firebase 에러?
→ Storage 규칙 배포 필요:
```bash
firebase init
firebase deploy --only storage
```
