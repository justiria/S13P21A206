
# ⚛️ React란 무엇인가

React는 Facebook(Meta)이 개발한 **사용자 인터페이스(UI) 라이브러리**입니다.  
컴포넌트 기반 아키텍처를 통해 웹 앱을 빠르고 효율적으로 개발할 수 있게 해주며,  
SPA(Single Page Application)에 최적화된 기술입니다.

---

## 📌 목차

1. [React의 특징](#react의-특징)
2. [React의 핵심 개념](#react의-핵심-개념)
3. [React 프로젝트 시작하기](#react-프로젝트-시작하기)
4. [React 주요 문법 예시](#react-주요-문법-예시)
5. [React 생태계 확장 도구](#react-생태계-확장-도구)
6. [React의 장단점](#react의-장단점)
7. [React vs 다른 프레임워크](#react-vs-다른-프레임워크)
8. [실무에서의 React 활용](#실무에서의-react-활용)

---

## 🔍 React의 특징

- ✅ **컴포넌트 기반 구조**: UI를 재사용 가능한 작은 단위로 분리
- ✅ **Virtual DOM**: DOM 변경 최소화로 성능 최적화
- ✅ **선언형 프로그래밍**: UI의 상태를 선언적으로 기술
- ✅ **단방향 데이터 흐름**: 예측 가능한 데이터 관리
- ✅ **JSX 문법**: JavaScript 안에 HTML을 작성하는 문법

---

## 🔧 React의 핵심 개념

### 1. 컴포넌트 (Component)

```jsx
function Hello(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

### 2. Props

- 부모 → 자식 컴포넌트로 전달되는 **읽기 전용 데이터**입니다.

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

### 3. State

- 컴포넌트 내부에서 관리되는 **변경 가능한 데이터(상태)**입니다.

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      클릭 수: {count}
    </button>
  );
}
```

### 4. useEffect

- 컴포넌트가 렌더링될 때마다 실행되는 **사이드 이펙트 처리용 훅**입니다.

```jsx
import { useEffect } from "react";

function MyComponent() {
  useEffect(() => {
    console.log("컴포넌트가 마운트되었습니다!");

    return () => {
      console.log("컴포넌트가 언마운트될 때 실행됩니다.");
    };
  }, []);

  return <div>useEffect 예시</div>;
}
```

---

### 5. 주요 Hook 정리

| Hook 이름     | 설명                                                       |
|---------------|------------------------------------------------------------|
| `useState`    | 상태(state)를 생성하고 관리합니다.                          |
| `useEffect`   | 생명주기 관리 및 사이드 이펙트 처리에 사용됩니다.           |
| `useContext`  | 전역 상태를 공유할 수 있도록 합니다.                       |
| `useRef`      | DOM 접근 또는 값 유지에 사용됩니다.                        |
| `useMemo`     | 연산 결과를 메모이제이션하여 성능을 최적화합니다.           |
| `useCallback` | 함수를 메모이제이션하여 불필요한 렌더링을 방지합니다.       |

---

## 🚀 React 프로젝트 시작하기

### ✅ CRA(Create React App) 사용

```bash
npx create-react-app my-app
cd my-app
npm start
```

### ✅ Vite로 시작하기

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

---

## ✨ React 주요 문법 예시

### 🔹 조건부 렌더링

```jsx
{isLogin ? <Dashboard /> : <Login />}
```

### 🔹 리스트 렌더링

```jsx
<ul>
  {fruits.map(fruit => <li key={fruit.id}>{fruit.name}</li>)}
</ul>
```

### 🔹 이벤트 처리

```jsx
<button onClick={handleClick}>Click me!</button>
```

### 🔹 스타일 적용

```jsx
const style = { color: "blue", fontSize: "20px" };
return <h1 style={style}>Hello</h1>;
```

---

## React 생태계 확장 도구

| 라이브러리                         | 용도                         |
|-----------------------------------|------------------------------|
| React Router                      | SPA 라우팅 관리              |
| Redux / Zustand / Recoil          | 전역 상태 관리               |
| Axios / TanStack Query            | API 요청 관리                |
| Styled-components / Tailwind CSS | CSS-in-JS 및 유틸 CSS        |
| React Hook Form                   | 폼 데이터 관리               |
| Jest / React Testing Library      | 테스트 도구                  |

---

## 👍 React의 장단점

### ✅ 장점

- 컴포넌트 재사용성  
- 빠른 렌더링 성능 (Virtual DOM)  
- 광범위한 생태계  
- 활발한 커뮤니티  

### ⚠️ 단점

- 러닝 커브 존재  
- 초기 설정이 복잡할 수 있음  
- SEO 최적화에 별도 설정 필요 (→ Next.js 권장)

---

## React vs 다른 프레임워크

| 항목           | React                | Vue                  | Angular           |
|----------------|----------------------|-----------------------|-------------------|
| 구조           | 라이브러리           | 프레임워크            | 프레임워크        |
| 학습 난이도    | 중간                 | 낮음                  | 높음              |
| 타입스크립트   | 선택사항              | 선택사항              | 내장 지원          |
| 성능           | 빠름                 | 빠름                  | 중간              |
| 커뮤니티       | 매우 활발            | 활발                  | 중간              |
| 주요 특징      | Virtual DOM, JSX     | 옵션 API, Template    | DI, RxJS          |

---

## 실무에서의 React 활용

- ✅ 대기업 웹사이트 (카카오, 네이버, 쿠팡 등)
- ✅ 스타트업 MVP 개발
- ✅ 관리자 대시보드 및 백오피스 시스템
- ✅ 쇼핑몰, 포트폴리오, 블로그 등 다양한 웹 프로젝트
