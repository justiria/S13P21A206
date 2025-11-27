# 📘 Jira 사용 가이드

## Jira란?

**Jira**는 Atlassian에서 개발한 **이슈 추적 및 프로젝트 관리 도구**입니다. 소프트웨어 개발팀을 위한 **애자일(Agile)** 환경에 최적화되어 있으며, **스크럼(Scrum)**, **칸반(Kanban)** 보드, **백로그 관리**, **릴리즈 계획**, **버그 추적** 등을 지원합니다.

---

## 주요 개념

| 용어 | 설명 |
|------|------|
| **Issue (이슈)** | 작업 단위. 버그, 기능, 할 일 등 다양한 유형을 포함 |
| **Project** | 이슈들이 속하는 단위. 팀 또는 제품 단위로 구성 |
| **Board** | 이슈를 시각화하여 관리하는 도구. 스크럼 또는 칸반 형식 |
| **Sprint** | 일정 기간 동안 완료할 작업을 계획하는 단위 |
| **Backlog** | 앞으로 수행할 이슈 목록 |
| **Workflow** | 이슈의 상태 전이 흐름 (예: Todo → In Progress → Done) |

---

## Jira 기본 사용법

### 1. 프로젝트 생성
- Jira에 로그인 후 **프로젝트 생성(Create Project)** 클릭
- 템플릿 선택: **Scrum, Kanban, Bug tracking** 등
- 프로젝트 이름 및 키 지정

### 2. 이슈 생성
- `Create` 버튼 클릭
- 이슈 유형 선택: `Task`, `Bug`, `Story`, `Epic` 등
- 제목, 설명, 우선순위 등 입력
- Assignee(담당자)와 Reporter(보고자) 지정

### 3. 보드 사용
- 칸반이나 스크럼 보드에서 드래그 앤 드롭으로 이슈 상태 변경
- 스프린트 보드에서는 스프린트 계획 및 시작 가능

### 4. 워크플로우 관리
- 프로젝트 설정 > Issues > Workflows
- 상태(State) 및 전이(Transition) 설정 가능
- 예: `To Do → In Progress → Code Review → Done`

---

## Jira 기능 요약

| 기능 | 설명 |
|------|------|
| 이슈 검색 | JQL (Jira Query Language)을 활용한 고급 검색 가능 |
| 대시보드 | 팀의 작업 현황을 시각화 |
| 라벨(Label) | 이슈 분류를 위한 태그 지정 |
| 플러그인 | Confluence, Bitbucket, Slack 등과 연동 가능 |
| 릴리즈 관리 | 버전 기반의 릴리즈 계획 및 배포 관리 |

---

## 유용한 팁

- `@`를 사용하여 팀원 멘션
- `#이슈번호`로 다른 이슈 참조
- 댓글에 `/` 입력으로 날짜, 링크, 이모지 삽입 가능
- 자동화 기능(Automation)을 사용하여 반복 작업 최소화

---

## 추천 링크

- [Jira 공식 사이트](https://www.atlassian.com/software/jira)
- [Jira 학습 자료 (공식)](https://www.atlassian.com/software/jira/guides)
- [Jira Software 설명서](https://support.atlassian.com/jira-software-cloud/)

---

# Jira: 스크럼 보드 & JQL 검색

## 1. 스크럼 보드 실습 예시

### Step 1: 스크럼 프로젝트 생성
1. Jira 대시보드 > `Create Project` 클릭
2. 템플릿에서 `Scrum software development` 선택
3. 프로젝트 이름 및 키 입력 후 생성

---

### Step 2: 백로그에 이슈 등록
1. 사이드바에서 `Backlog` 클릭
2. `Create issue`를 눌러 작업 항목(Task, Story 등) 작성  
   예:
   - `회원가입 기능 개발`
   - `API 인증 토큰 적용`
   - `버그 수정: 로그인 실패`

---

### Step 3: 스프린트 계획 수립
1. `Create Sprint` 클릭
2. 필요한 이슈들을 스프린트에 드래그
3. `Start Sprint` → 기간 선택(예: 2주), 이름 작성 → 시작

---

### Step 4: 보드에서 작업 관리
- `Board` 탭 클릭 시 칸반 형식 보드 확인 가능
- 이슈 카드를 `To Do → In Progress → Done` 순서로 드래그하여 상태 변경

---

### Step 5: 스프린트 종료
- 스프린트 기간이 끝나면 `Complete Sprint` 클릭
- 미완료된 이슈는 자동으로 다음 백로그로 이동

---

## 🔍 2. JQL (Jira Query Language) 검색 예제

### 기본 문법
- `project = [프로젝트 키]`
- `status = "In Progress"`
- `assignee = [사용자명]`
- `created >= -7d` (최근 7일 이내 생성)

---

### 자주 쓰는 예제

| 목적 | JQL 문법 |
|------|----------|
| 특정 프로젝트의 모든 이슈 | `project = "DEV"` |
| 진행 중인 이슈 | `status = "In Progress"` |
| 나에게 할당된 이슈 | `assignee = currentUser()` |
| 특정 기간 내 생성된 이슈 | `created >= "2025-07-01"` |
| 오늘 완료된 이슈 | `status = Done AND resolved >= startOfDay()` |
| 에픽 아래 모든 이슈 | `epicLink = EPIC-123` |
| 특정 우선순위 이슈 | `priority = High` |

---



**Tip:** Jira는 Confluence, Bitbucket, Trello 등과 함께 쓰면 더욱 강력한 협업 도구가 됩니다
