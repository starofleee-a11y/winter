# Style Analyzer - AI 스타일 분석 & 아트 변환 웹사이트

사용자의 사진을 업로드하면 AI가 옷 색감과 메이크업 스타일을 분석하여 4가지 스타일 중 하나로 분류하고, 해당 스타일의 아트로 변환해주는 모바일 반응형 웹 애플리케이션입니다.

## 🎨 주요 기능

### 4가지 스타일 분류

1. **Vanilla Girl** 🤍
   - 베이지, 아이보리 계열의 성숙하고 우아한 스타일
   - 클래식 디즈니 공주 그림체로 변환

2. **Strawberry Girl** 🍓
   - 핑크, 레드, 퍼플 계열의 러블리하고 화려한 스타일
   - 세일러문 스타일 시티팝 일러스트로 변환

3. **Coffee Girl** ☕
   - 블랙, 그레이, 브라운 계열의 시크하고 트렌디한 스타일
   - Bratz 캐릭터 일러스트로 변환

4. **Clean Girl** 🤍
   - 화이트, 뉴트럴 계열의 자연스럽고 깔끔한 스타일
   - 지브리 스튜디오 일러스트로 변환

### AI 분석 알고리즘

- **색상 분석**: 클라이언트 사이드에서 k-means 클러스터링으로 주요 색상 추출
- **Google Cloud Vision API**: 이미지 라벨링, 색상 속성, 얼굴 감지, 메이크업/악세서리 탐지
- **하이브리드 분류**: 색상 분석 + Vision API 결과를 종합하여 스타일 점수 계산
- **AI 아트 변환**: Replicate API로 스타일별 맞춤 일러스트 생성

## 🛠 기술 스택

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** - 모바일 반응형 디자인
- **React Hooks**

### Backend & Services
- **Firebase** (Storage, Firestore)
- **Google Cloud Vision API** - 이미지 분석
- **Replicate API** - AI 이미지 생성

### AI/ML
- 커스텀 색상 분석 알고리즘 (k-means)
- 스타일 분류 점수 시스템
- Stable Diffusion & Anime 모델

## 📦 설치 방법

### 1. 레포지토리 클론

```bash
git clone <repository-url>
cd winter
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 필요한 값을 입력하세요:

```bash
cp .env.example .env.local
```

필요한 환경 변수:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Cloud Vision API
GOOGLE_APPLICATION_CREDENTIALS=

# Replicate API
REPLICATE_API_TOKEN=
```

### 4. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Firebase Storage 활성화
3. 프로젝트 설정에서 웹 앱 추가 후 Config 정보 복사

### 5. Google Cloud Vision API 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. Vision API 활성화
3. 서비스 계정 생성 후 JSON 키 다운로드
4. `GOOGLE_APPLICATION_CREDENTIALS` 경로 설정

### 6. Replicate API 설정

1. [Replicate](https://replicate.com/) 계정 생성
2. API 토큰 발급
3. `.env.local`에 추가

### 7. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 🚀 배포

### Vercel 배포 (권장)

```bash
npm install -g vercel
vercel
```

환경 변수를 Vercel 대시보드에서 설정해주세요.

### 기타 플랫폼

Next.js는 다양한 플랫폼에 배포 가능합니다:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker

## 📱 사용 방법

1. 메인 페이지에서 **사진 업로드** 버튼 클릭
2. 전신 또는 상반신 사진 선택 (얼굴, 옷, 메이크업이 잘 보이는 사진 권장)
3. **스타일 분석하기** 버튼 클릭
4. AI가 색상과 스타일을 분석 (약 5-10초 소요)
5. 분석 결과 확인:
   - 당신의 스타일 타입
   - 스타일 특징
   - 색상 분석 결과
   - AI 아트 변환 이미지 (1-2분 소요)

## 🏗 프로젝트 구조

```
winter/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── analyze-vision/ # Google Cloud Vision
│   │   └── generate-image/ # Replicate 이미지 생성
│   ├── layout.tsx
│   ├── page.tsx           # 메인 페이지
│   └── globals.css
├── components/            # React 컴포넌트
│   ├── ImageUpload.tsx   # 이미지 업로드
│   └── StyleResult.tsx   # 결과 표시
├── lib/                   # 유틸리티 & 로직
│   ├── colorAnalysis.ts  # 색상 분석 알고리즘
│   ├── styleClassifier.ts # 스타일 분류 로직
│   ├── styleDefinitions.ts # 스타일 정의
│   ├── styleAnalysis.ts  # 메인 분석 로직
│   ├── firebase.ts       # Firebase 설정
│   └── firebaseStorage.ts # 이미지 업로드
├── types/                 # TypeScript 타입
│   └── index.ts
├── public/               # 정적 파일
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🧪 테스트 가이드

### 스타일별 테스트 이미지 권장사항

1. **Vanilla Girl**: 베이지/아이보리 옷, 자연스러운 메이크업, 우아한 악세서리
2. **Strawberry Girl**: 핑크/레드 옷, 화려한 메이크업, 귀여운 스타일
3. **Coffee Girl**: 블랙/그레이 옷, 선글라스, 시크한 분위기
4. **Clean Girl**: 화이트/뉴트럴 옷, 자연스러운 메이크업, 캐주얼

### QA 체크리스트

- [ ] 다양한 조명 환경의 사진 테스트
- [ ] 여러 각도의 사진 테스트
- [ ] 각 스타일별 대표 이미지 테스트
- [ ] 모바일/태블릿/데스크톱 반응형 확인
- [ ] 이미지 생성 시간 측정
- [ ] 분류 정확도 검증

## 🔧 개발 시 고려사항

### 분류 정확도 개선

현재 알고리즘은 색상과 Vision API 라벨을 기반으로 점수를 계산합니다. 정확도 개선을 위해:

1. `lib/styleClassifier.ts`에서 각 스타일의 점수 가중치 조정
2. 더 많은 테스트 이미지로 키워드 패턴 확장
3. Vision API 외 추가 메이크업 감지 모델 통합 고려

### 이미지 생성 최적화

- Replicate API 응답 시간: 평균 30초 - 2분
- 비용: 모델당 $0.003 - $0.01 per generation
- 캐싱 전략 고려 (동일 사용자의 재분석)

### 성능 최적화

- 이미지 리사이징: 색상 분석 시 200x200으로 축소
- API 호출 최소화: 클라이언트 사이드 색상 분석 우선
- Firebase Storage 규칙 설정

## 📝 라이센스

MIT License

## 👥 기여

이슈와 PR을 환영합니다!

## 📞 문의

프로젝트 관련 문의사항은 이슈로 등록해주세요.
