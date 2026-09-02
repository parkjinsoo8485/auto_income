# 🏭 Auto-App-Builder: 공장형 모바일 앱 무인 자동 빌드 시스템

구글 플레이스토어 AdMob 기반 어학/학습 앱을 **JSON 설정 파일 하나로 100% 무인 생성/변형/빌드/패키징**하는 Python 오케스트레이터 시스템입니다.

---

## 🌟 핵심 기능 및 서브 에이전트 아키텍처

```
app_config.json (단 1개의 설정 파일)
      │
      ▼
[1. Asset Generation Agent] (engine/generator.py)
   ├── 🎨 Pillow: Android Mipmap(mdpi~xxxhdpi) 및 512x512 고해상도 아이콘 자동 리사이징
   ├── 🔊 Edge-TTS / gTTS: 학습 단어 및 예문 원어민 음성(.mp3) 일괄 고속 생성
   └── 📱 ASO Generator: 1080x1920 Google Play 규격 스마트폰 목업 스크린샷 5종 자동 합성
      │
      ▼
[2. Source Code Mutation Agent] (engine/mutator.py - 안티스팸 방어)
   ├── 🛡️ AST/바이트코드 변형: 무작위 더미 클래스/메서드 및 투명 위젯(SizedBox, Padding) 동적 주입
   ├── 🏷️ 패키지 ID 치환: AndroidManifest.xml, build.gradle의 applicationId 자동 교체
   └── 🎨 테마 주입: primary/secondary 색상 및 레이아웃 모드(Grid/List/Carousel) 동적 컴파일
      │
      ▼
[3. Build & Release Packaging Agent] (engine/builder.py)
   ├── 🔑 Keystore 생성: 앱별 독립 JKS 서명키 및 key.properties 자동 발급
   ├── 📦 Flutter Release Build: Android App Bundle (.aab) 컴파일
   └── 🗜️ 원스톱 패키징: 서명된 AAB + 스토어 스크린샷 + 메타데이터 텍스트를 zip으로 자동 압축
```

---

## 🚀 빠른 시작 (CLI 명령어)

### 1. 단일 앱 빌드
```bash
python pipeline.py --config configs/korean_basic_vocab.json
```

### 2. 폴더 내 모든 앱 설정 대량 일괄 빌드 (공장 가동)
```bash
python batch_runner.py --configs_dir configs
```

---

## 📁 산출물 디렉토리 구조 (`build_output/`)

```
build_output/
├── learn_korean_daily_-_hangul_&_words/
│   ├── com.langmaster.korean.basic-release.aab      # 구글 플레이 등록용 최종 서명된 AAB
│   ├── com.langmaster.korean.basic.jks              # 앱 전용 Keystore 서명키
│   ├── store_listing_metadata.txt                   # 스토어 제목, 설명문, 키워드 텍스트
│   └── com.langmaster.korean.basic_complete_release.zip # 배포용 전체 패키지 압축본
└── store_assets/
    ├── icon_512.png                                 # 512x512 고해상도 스토어 아이콘
    ├── screenshot_1.png                             # 목업 적용 스토어 홍보 스크린샷 1
    ├── screenshot_2.png                             # 목업 적용 스토어 홍보 스크린샷 2
    ├── screenshot_3.png                             # 목업 적용 스토어 홍보 스크린샷 3
    ├── screenshot_4.png                             # 목업 적용 스토어 홍보 스크린샷 4
    └── screenshot_5.png                             # 목업 적용 스토어 홍보 스크린샷 5
```
