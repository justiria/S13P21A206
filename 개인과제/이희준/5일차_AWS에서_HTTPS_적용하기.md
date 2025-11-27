# AWS에서 HTTPS 적용하기 (ELB & Nginx + Certbot 방식 비교)

## 1. ELB(Elastic Load Balancer)란?

- 트래픽(부하)을 적절하게 분산해주는 장치  
- 서버가 2대 이상일 경우 필수적으로 도입
- 하지만 이번에는 **ELB의 로드밸런싱 기능이 아닌, SSL/TLS(HTTPS) 적용 기능**에 집중

---

## 2. SSL/TLS와 HTTPS란?

### 🔐 SSL/TLS
- HTTP를 HTTPS로 바꿔주는 **보안 인증서**
- ELB는 SSL/TLS 인증서를 적용할 수 있음

### 🌐 HTTPS 적용 이유
1. **보안**
   - 서버와의 통신 데이터를 암호화
   - 중간자 공격 방지
2. **사용자 신뢰**
   - HTTPS가 적용되지 않으면 브라우저에서 위험 경고 표시
   - 사용자 이탈 가능성 ↑

### ✅ 현업에서의 HTTPS 적용
- 대부분의 웹사이트는 HTTPS를 필수로 사용
- 백엔드 서버와의 통신도 **HTTPS 도메인 주소**를 이용함
  - 웹사이트: `https://test.co.kr`
  - 백엔드 API: `https://api.test.co.kr`

---

## 3. ELB를 활용한 아키텍처

### 💻 ELB 도입 전
- 사용자 → EC2 직접 요청

### ☁️ ELB 도입 후
- 사용자 → ELB → EC2  
- **도메인**과 **HTTPS**를 ELB에 연결

---

## 4. ELB 세팅 방법

### 로드 밸런서 생성
1. EC2 → 로드 밸런서 메뉴 → 생성
2. 유형: **Application Load Balancer**
3. 이름: `test-server-elb`
4. IP 주소 유형: IPv4
5. 가용 영역: 전체 선택

### 보안 그룹 설정
- EC2와는 별도
- 인바운드 규칙:
  - HTTP(80): 모든 IPv4 허용
  - HTTPS(443): 모든 IPv4 허용
- 아웃바운드 규칙: 기본값 그대로

---

## 5. 대상 그룹 생성 및 라우팅 설정

### 대상 그룹 설정
- 대상 유형: 인스턴스
- 이름: `test-server-target-group`
- 프로토콜: HTTP
- 포트: 80
- 상태 검사(Health Check):
  - 프로토콜: HTTP
  - 경로: `/health`

### 대상 등록
- EC2 인스턴스 선택
- 포트: 80
- → 보류 중인 항목 포함 클릭 → 생성 완료

---

## 6. 헬스 체크 API 설정

- 각 인스턴스(백엔드 서버)에 `/health` 경로로 GET 요청
- 응답: 200번대 상태 코드 → 정상
- → 고장난 인스턴스로는 트래픽 전송 X

---

## 7. ELB에 도메인 연결하기 (Route 53)

1. Route53 → 호스팅 영역
2. 기존 EC2 연결 레코드 삭제
3. 새 레코드 생성
   - 이름: `api.test.link`
   - 유형: A → **별칭(ALIAS)** 선택
   - 대상: Application Load Balancer 선택
   - 리전 및 로드밸런서 선택 → 생성

---

## 8. HTTPS 적용 (AWS Certificate Manager)

1. Certificate Manager → 인증서 요청
2. **퍼블릭 인증서 요청** → 도메인 입력 (예: `api.test.link`)
3. 검증 방법: **DNS 검증**
4. Route53에서 CNAME 레코드 자동 생성
5. 인증 상태: "성공" 표시

---
## 9. HTTPS 리스너 추가

1. ELB → 리스너 추가
2. HTTPS 443 → 대상 그룹 연결
3. 인증서 선택: 위에서 발급받은 인증서

---

## 10. HTTP 요청 → HTTPS 리디렉션 설정

1. 기존 HTTP:80 리스너 삭제
2. 새 리스너 추가:
   - 포트: 80
   - 동작: **URL 리디렉션**
   - 대상 포트: **HTTPS 443**

---

## 11. 클린업 (비용 방지)

- 로드밸런서 삭제
- EC2 인스턴스 종료
- 탄력적 IP 해제 및 릴리스

---

## 12. Nginx & Certbot을 활용한 HTTPS 적용

### 0️⃣ 사전 준비
- EC2 인스턴스 실행 + 탄력적 IP 부여
- 도메인 구매 및 Route53 연결
- 백엔드 서버 구동

### 1️⃣ Nginx 설치
```bash
sudo apt update
sudo apt install nginx
```

### 2️⃣ Certbot 설치 및 인증서 발급
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d [도메인주소]
```
이메일 입력 → Y → 성공 메시지 확인

### 3️⃣ 리버스 프록시 설정 (Nginx)
- /etc/nginx/sites-available/default 파일 수정
- 기존 try_files 주석처리

아래 내용 추가:
```bash
location / {
    proxy_pass http://localhost:[백엔드포트]/;
}
```

Nginx 재시작:
```bash
sudo service nginx restart
```

### 🔄 ELB vs Nginx + Certbot 방식

| 항목 | ELB 방식 | Nginx + Certbot 방식 |
|------|----------|---------------------|
| ✅ 적용 용이성 | 쉬움 (GUI, 자동 갱신) | 약간 복잡함 (CLI 기반) |
| 💸 비용 | 비용 발생 | EC2만 사용하면 무료 |
| 🛡️ 인증서 관리 | 자동 갱신 지원 | certbot 자동 갱신 설정 필요 |
| 💡 현업 사용 | 대규모 서비스에 적합 | 소규모 혹은 비용 민감한 프로젝트에 적합 |

## ✅ 정리

- HTTPS 적용은 보안과 신뢰를 위해 필수
- AWS에서는 ELB + Certificate Manager 조합이 일반적
- 비용이나 간단한 구조가 중요할 경우 Nginx + Certbot도 좋은 선택