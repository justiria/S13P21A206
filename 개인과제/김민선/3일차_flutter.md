# Flutter 완전 정복 가이드

## 개요

> **Flutter**는 Google이 개발한 **오픈소스 UI 툴킷**으로, 하나의 코드베이스로 **iOS, Android, 웹, 데스크탑 앱**을 모두 개발할 수 있게 해준다.

---

## Flutter란?

| 항목 | 설명 |
|------|------|
| 개발사 | Google |
| 언어 | Dart |
| 렌더링 | 자체 렌더링 엔진(Skia) |
| 특징 | Hot Reload, 위젯 중심 아키텍처, 고성능, 크로스플랫폼 |
| 플랫폼 | Android, iOS, Web, Windows, macOS, Linux |

---

## 기본 개념

### Dart 언어
- Flutter는 **Dart**로 개발됨
- JavaScript와 유사한 문법 + 정적 타입
- JIT (개발 시 빠른 컴파일) + AOT (릴리즈 시 고성능 컴파일) 지원

### 위젯 중심 구조
- 모든 UI 요소는 **Widget**이다.
- 예: `Text`, `Button`, `Column`, `Row`, `Scaffold` 등

### Hot Reload
- 앱을 재시작하지 않고도 코드 변경사항을 실시간 반영
- 빠른 UI 개발에 유리

---

## 프로젝트 구조
my_app/
│
├── android/         # Android 네이티브 코드
├── ios/             # iOS 네이티브 코드
├── lib/             # 주 개발 코드 (main.dart 포함)
│   └── main.dart
├── test/            # 테스트 코드
├── pubspec.yaml     # 의존성, 리소스 관리 파일


## 주요 위젯

| 위젯 | 설명 |
|------|------|
| `Text` | 텍스트 출력 |
| `Container` | 박스 영역, 스타일 지정 |
| `Row` / `Column` | 가로/세로 레이아웃 |
| `Scaffold` | 앱 기본 구조 제공 (AppBar, Drawer 등 포함) |
| `ListView` | 스크롤 가능한 리스트 |
| `GestureDetector` | 터치 이벤트 감지 |
| `StatefulWidget` | 상태 변화가 필요한 위젯 |
| `StatelessWidget` | 불변 상태 위젯 |

---

## 기본 명령어

```bash
# 프로젝트 생성
flutter create my_app

# 앱 실행
flutter run

# 의존성 설치
flutter pub get

# 릴리즈 빌드
flutter build apk
flutter build ios

## 상태관리 방식

| 방식 | 설명 | 사용 상황 |
|------|------|-----------|
| `setState` | 기본 제공 방식 | 간단한 상태 관리 |
| Provider | 구글 권장, InheritedWidget 기반 | 중소형 앱 |
| Riverpod | Provider 개선판, 테스트 용이 | 구조화된 앱 |
| Bloc / Cubit | 명확한 비즈니스 로직 분리 | 대규모 앱 |
| GetX | 간단한 문법, 빠른 학습 | 빠른 MVP 개발 |
| MobX | 반응형 프로그래밍 방식 | 옵저버 기반 아키텍처 선호시 |

## 주요 라이브러리 추천

| 라이브러리 | 설명 |
|------------|------|
| `http` | REST API 호출 |
| `provider` | 상태 관리 |
| `flutter_bloc` | 상태 및 비즈니스 로직 분리 |
| `shared_preferences` | 간단한 로컬 저장소 |
| `dio` | 고급 HTTP 클라이언트 |
| `flutter_hooks` | Hook 방식의 위젯 상태 관리 |
| `flutter_secure_storage` | 보안 저장소 |
| `firebase_core`, `firebase_auth` | Firebase 연동 |
