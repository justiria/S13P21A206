## 기술 스택

- **UI/UX**: Figma
- **Frontend**: React, TypeScript
- **Backend**: Spring Boot, Java
- **Database**: MySQL
- **Deployment**: AWS EC2·RDS·S3, Vercel
- **CI/CD**: Jenkins, Docker, Nginx
- **Gen AI API**
  - **Openai**: gpt-4o, gpt-4o-mini, dall-e-3
  - **Gemini**: imagen-3.0-generate-002

## 의존성

### 프론트엔드 의존성

| 카테고리                    | 패키지                    | 버전     |
| --------------------------- | ------------------------- | -------- |
| **Calendar**                | @fullcalendar/daygrid     | 6.1.18   |
|                             | @fullcalendar/interaction | 6.1.18   |
|                             | @fullcalendar/react       | 6.1.18   |
|                             | @fullcalendar/rrule       | 6.1.19   |
|                             | @fullcalendar/timegrid    | 6.1.18   |
| **3D & Graphics**           | @react-three/drei         | 10.6.1   |
|                             | @react-three/fiber        | 9.0.0    |
|                             | @react-three/rapier       | 2.1.0    |
|                             | meshline                  | 3.3.1    |
|                             | three                     | 0.167.1  |
|                             | ogl                       | 1.0.11   |
| **Animation & Motion**      | gsap                      | 3.13.0   |
|                             | motion                    | 12.23.12 |
|                             | particles-bg              | 2.5.5    |
|                             | react-tsparticles         | 2.12.2   |
|                             | tsparticles               | 3.8.1    |
| **React Ecosystem**         | react                     | 19.1.0   |
|                             | react-dom                 | 19.1.0   |
|                             | react-router-dom          | 7.7.0    |
|                             | react-icons               | 5.5.0    |
|                             | react-pageflip            | 2.0.3    |
| **Real-time Communication** | livekit-client            | 2.15.3   |
|                             | sockjs-client             | 1.6.1    |
|                             | stompjs                   | 2.3.3    |
| **Utility**                 | jwt-decode                | 4.0.0    |
|                             | uuid                      | 11.1.0   |
| **UI Components**           | swiper                    | 11.2.10  |
| **Build Tools**             | vite-plugin-svgr          | 4.3.0    |

### 백엔드 의존성

| 카테고리                 | 패키지                                                   | 버전     |
| ------------------------ | -------------------------------------------------------- | -------- |
| **Spring Boot Starters** | org.springframework.boot\:spring-boot-starter-web        | 3.5.3    |
|                          | org.springframework.boot\:spring-boot-starter-security   | 3.5.3    |
|                          | org.springframework.boot\:spring-boot-starter-data-jpa   | 3.5.3    |
|                          | org.springframework.boot\:spring-boot-starter-validation | 3.5.3    |
|                          | org.springframework.boot\:spring-boot-starter-websocket  | 3.5.3    |
|                          | org.springframework.boot\:spring-boot-starter-webflux    | 3.5.3    |
| **JWT**                  | io.jsonwebtoken\:jjwt-api                                | 0.12.3   |
|                          | io.jsonwebtoken\:jjwt-impl                               | 0.12.3   |
|                          | io.jsonwebtoken\:jjwt-jackson                            | 0.12.3   |
| **LiveKit**              | io.livekit\:livekit-server                               | 0.8.2    |
| **AWS**                  | org.springframework.cloud\:spring-cloud-starter-aws      | 2.2.6.   |
|                          | com.amazonaws\:aws-java-sdk-s3                           | 1.12.710 |
|                          | net.coobird\:thumbnailator                               | 0.4.14   |
| **Media**                | org.jcodec\:jcodec                                       | 0.2.5    |
|                          | org.jcodec\:jcodec-javase                                | 0.2.5    |
| **HTTP & JSON**          | com.squareup.okhttp3\:okhttp                             | 5.1.0    |
|                          | org.json\:json                                           | 20240303 |
| **DB Driver**            | com.h2database\:h2                                       | 3.5.3    |
|                          | com.mysql\:mysql-connector-j                             | 3.5.3    |
| **Test**                 | org.springframework.boot\:spring-boot-starter-test       | 3.5.3    |
|                          | org.springframework.security\:spring-security-test       | 3.5.3    |
|                          | org.junit.platform\:junit-platform-launcher              | 3.5.3    |

## 환경 변수

### 프론트엔드 환경 변수

**.env**

```
VITE_API_BASE_URL=${VITE_API_BASE_URL}
VITE_API_PREFIX=/api/v1
VITE_LIVEKIT_WS_URL=${VITE_LIVEKIT_WS_UR}
```

### 백엔드 환경 변수

**.env**

```
DB_URL=jdbc:mysql://${AICONTACT_DB_URL}/aicontact?useSSL=true&serverTimezone=Asia/Seoul&characterEncoding=UTF-8
DB_USERNAME=${AICONTACT_DB_USERNAME}
DB_PASSWORD=${AICONTACT_DB_PASSWORD}
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
JWT_SECRET_KEY=${JWT_SECRET_KEY}
GMS_KEY=Bearer ${GMS_KEY}
GPT_ENDPOINT=${GMS_GPT_ENDPOINT}
DALLE_ENDPOINT=${GMS_DALLE_ENDPOINT}
IMAGEN_ENDPOINT=${GMS_IMAGEN_ENDPOINT}

# === LiveKit 설정 (필수) ===
LIVEKIT_API_KEY=${LIVEKIT_API_KEY}
LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET}
```

**application.properties**

```
# Server Configuration
server.port=${SERVER_PORT}
server.servlet.context-path=/api/v1

# Environment Variables Import
spring.config.import=optional:file:.env[.properties]

# ====================================================================
# External API Configuration
# ====================================================================

# AI Service (GMS) Configuration
gms.api.endpoint=${GPT_ENDPOINT}
gms.api.key=${GMS_KEY}

# ====================================================================
# AWS S3 Configuration
# ====================================================================

# AWS Credentials
cloud.aws.credentials.access-key=${AWS_ACCESS_KEY_ID}
cloud.aws.credentials.secret-key=${AWS_SECRET_ACCESS_KEY}
cloud.aws.region.static=ap-northeast-2

# S3 Bucket Configuration
cloud.aws.s3.bucket=${S3_BUCKET_NAME}
cloud.aws.s3.url=https://${S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com

# ====================================================================
# Database Configuration
# ====================================================================

# MySQL/RDS Configuration
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.jdbc.time_zone=Asia/Seoul
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy

# ====================================================================
# Security Configuration
# ====================================================================

# JWT Configuration
spring.jwt.secret=${JWT_SECRET_KEY}
jwt.access-token-validity=${JWT_ACCESS_TOKEN_VALIDAITY}
jwt.refresh-token-validity=${JWT_REFRESH_TOKEN_VALIDAITY}

# ====================================================================
# File Upload Configuration
# ====================================================================

# Multipart File Upload Settings
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=100MB

# Allowed Origins (Frontend URLs)
cors.allowed-origins=https://aicontact-gamma.vercel.app,http://localhost:5173

# ====================================================================
# Logging Configuration
# ====================================================================

# Application Logging
logging.level.com.aicontact=DEBUG

# Security Logging
logging.level.org.springframework.security=DEBUG

# SQL Logging
logging.level.org.hibernate.SQL=DEBUG

# ====================================================================
# Development Database Configuration (H2 - Commented Out)
# ====================================================================

# H2 In-Memory Database (For Development Only)
#spring.datasource.url=jdbc:h2:mem:testdb
#spring.datasource.driver-class-name=org.h2.Driver
#spring.datasource.username=${SPRING_DB_USERNAME}
#spring.datasource.password=${SPRING_DB_PASSWORD}
#spring.h2.console.enabled=true

# H2 Database Initialization
#spring.sql.init.mode=always
#spring.sql.init.schema-locations=classpath:h2/schema.sql
#spring.sql.init.data-locations=classpath:h2/data.sql

```

## 배포 환경 설정

### Docker 설정

**docker ps 결과 : SpringBoot 서버(Backend 서버) , Livekit(화상 통화 서버)**

<img src="img/docker_ps.png">

**docker-compose.yml**

- **SpringBoot** : Dockerfile을 통한 이미지 빌드 후 컨테이너 생성
- **Livekit** : Dockerhub의 가장 최신 Livekit 이미지(latest) 다운로드 후 컨테이너 생성

```
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: my-app:latest
    ports:
      - "127.0.0.1:8081:8080"
    env_file:
      - .env
    environment:
      SPRING_DATASOURCE_URL: "${DB_URL}"
      SPRING_DATASOURCE_USERNAME: "${DB_USERNAME}"
      SPRING_DATASOURCE_PASSWORD: "${DB_PASSWORD}"
      SPRING_JWT_SECRET: "${JWT_SECRET_KEY}"
      AWS_ACCESS_KEY_ID: "${AWS_ACCESS_KEY_ID}"
      AWS_SECRET_ACCESS_KEY: "${AWS_SECRET_ACCESS_KEY}"
      S3_BUCKET_NAME: "${S3_BUCKET_NAME}"
      # LiveKit 환경변수 추가
      LIVEKIT_API_KEY: "${LIVEKIT_API_KEY:-devkey}"
      LIVEKIT_API_SECRET: "${LIVEKIT_API_SECRET:-secret}"
      # 시간대 설정 추가
      TZ: Asia/Seoul
    restart: always

  livekit:
    image: livekit/livekit-server:latest
    container_name: livekit
    restart: unless-stopped
    environment:
      LIVEKIT_KEYS: "devkey: secret"
      LIVEKIT_CONFIG: |
        rtc:
          udp_port: 8882
          tcp_port: 8881
        webhook:
          api_key: devkey
          urls:
            - http://host.docker.internal:8081/calls/livekit/webhook
    command:
      - --bind=0.0.0.0
      - --node-ip=3.35.17.1
      - --port=8880
    ports:
      - "127.0.0.1:8880:8880"   # 시그널링
      - "8881:8881"             # TCP RTC
      - "8882:8882/udp"         # UDP RTC
```

### Nginx 설정

**편집 명령어**

```
sudo vim /etc/nginx/sites-available/default
```

**Nginx 설정 파일**

```
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	root /var/www/html;

	index index.html index.htm index.nginx-debian.html;

	server_name _;

	location / {
		try_files $uri $uri/ =404;
	}
}

server {
	root /var/www/html;
	index index.html index.htm index.nginx-debian.html;
    server_name i13a702.p.ssafy.io; # managed by Certbot

	location / {
		try_files $uri $uri/ =404;
	}

    listen 443 ssl; # managed by Certbot
    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/i13a702.p.ssafy.io/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/i13a702.p.ssafy.io/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    client_max_body_size 100M;

    location ^~ /api/ {
        proxy_pass         http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header   Host            $host;
        proxy_set_header   X-Real-IP       $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;

        proxy_set_header   Upgrade         $http_upgrade;
        proxy_set_header   Connection      "upgrade";
    }

    location ^~ /rtc/ {
        proxy_pass         http://127.0.0.1:8880/;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade         $http_upgrade;
        proxy_set_header   Connection      "upgrade";
        proxy_set_header   Host            $host;
        proxy_set_header   X-Real-IP       $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    location ^~ /dashboard/ {
        proxy_pass         http://127.0.0.1:7880/dashboard/;
        proxy_http_version 1.1;
        proxy_set_header   Host          $host;
        proxy_set_header   X-Real-IP     $remote_addr;
    }
}
server {
    if ($host = i13a702.p.ssafy.io) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

	listen 80 ;
	listen [::]:80 ;
    server_name i13a702.p.ssafy.io;
    return 404; # managed by Certbot
}
```

### Jenkins 설정

**젠킨스 파이프라인 스크립트** : 본 프로젝트는 MonoRepo 구조로, 특정 디렉토리(AI_Contact_BE) 를 추적하여 자동으로 배포가 진행하도록 함. Gitlab Webhook 뿐만 아니라, parameter를 활용한 BE의 수동 배포를 가능하게 함.

**Jenkinsfile**

```
pipeline {
  agent any
  options { skipDefaultCheckout(true) }

  parameters {
    booleanParam(name: 'FORCE_BE_DEPLOY', defaultValue: false, description: 'BE 배포 강제 실행')
  }

  environment {
    BE_DIR    = 'AI_Contact_BE'
    GH_REMOTE = 'github'
    GH_BRANCH = 'master'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare Backend') {
      steps {
        checkout scm   // ← 워크스페이스를 원본 repo 상태로 완전 복구
      }
    }

    stage('Deploy Backend') {
      when {
        beforeAgent true
        anyOf {
          changeset pattern: "${BE_DIR}/**", caseSensitive: true   // BE 디렉터리 변경 시
          expression { return params.FORCE_BE_DEPLOY }             // 강제 실행 스위치
        }
      }
      steps {
        dir("${BE_DIR}") {
          withCredentials([
            file(credentialsId: 'my-env-file',   variable: 'ENV_PATH'),
            file(credentialsId: 'my-properties', variable: 'PROP_PATH')
          ]) {
            sh '''
              cp "$ENV_PATH" .env
              chmod 644 .env
            '''
            sh '''
              mkdir -p src/main/resources
              cp "$PROP_PATH" src/main/resources/application.properties
              chmod 644 src/main/resources/application.properties
            '''
            sh 'docker-compose down || true'
            sh 'docker-compose up -d --build --force-recreate'
          }
        }
      }
    }
  }
}
```

### Credential

**Credential 관리** : 빌드에 필요한 설정 파일들을 저장해두고 배포 시 특정 경로에 파일을 옮겨 서버에 올린다.

<img src="img/Credentials.png">

- **gitlab-https** : gitlab의 프로젝트를 clone 해오기위한 credential (gitlab API 토큰)
- **ec2-ssh** : jenkins에서 우리의 aws ec2의 ssh에 접속하기 위한 credential
- **my-env-file, my-properties** : 백엔드 설정파일들
  프로젝트 최종 배포시 중요한 정보들이 들어있는 Spring 설정 파일들을 gitlab에 올리지않기 때문에 Jenkins
  에 미리 저장해두고 파이프라인속 build 전단계에 가져오기 위함

### 배포 파일 생성

**Dockerfile**

```
# ─── Stage 1: Build ───────────────────────────────────────────
FROM gradle:jdk21 AS builder
WORKDIR /app

# 1) 캐시를 위해 빌드스크립트 먼저 복사
COPY settings.gradle build.gradle gradlew ./
COPY gradle gradle/
RUN chmod +x gradlew

# 2) 의존성만 미리 다운로드
RUN ./gradlew dependencies --no-daemon --quiet

# 3) 소스 복사 후 실제 빌드
COPY . .
RUN chmod +x gradlew \
 && ./gradlew bootJar -x test --no-daemon --quiet

# ─── Stage 2: Runtime ─────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Spring Boot fat JAR 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 컨테이너 포트 문서화
EXPOSE 8081

ENTRYPOINT ["java","-jar","/app/app.jar"]
```

## 프로젝트 구조

### 프론트엔드 프로젝트 구조

```
src
├── App.tsx
├── global.d.ts
├── index.css
├── main.tsx
├── vite-env.d.ts
│
├── apis
│   ├── fetchClient.ts
│   ├── aiChild
│   │   ├── api.ts
│   │   ├── index.ts
│   │   ├── request.ts
│   │   └── response.ts
│   ├── auth
│   │   ├── api.ts
│   │   ├── index.ts
│   │   ├── request.ts
│   │   └── response.ts
│   ├── babychat
│   │   ├── api.ts
│   │   ├── index.ts
│   │   ├── request.ts
│   │   ├── response.ts
│   │   └── types.ts
│   ├── chat
│   │   ├── api.ts
│   │   ├── index.ts
│   │   ├── request.ts
│   │   └── response.ts
│   ├── comicStrips
│   │   ├── api.ts
│   │   ├── index.ts
│   │   ├── request.ts
│   │   └── response.ts
│   ├── couple
│   │   ├── api.ts
│   │   ├── index.ts
│   │   ├── request.ts
│   │   └── response.ts
│   ├── dailySchedule
│   │   ├── api.ts
│   │   ├── index.ts
│   │   ├── request.ts
│   │   └── response.ts
│   ├── letter
│   │   ├── api.ts
│   │   ├── generate.ts
│   │   ├── index.ts
│   │   ├── request.ts
│   │   ├── response.ts
│   │   └── useUnreadLettersCounts.ts
│   ├── media
│   │   ├── api.ts
│   │   ├── index.ts
│   │   ├── request.ts
│   │   └── response.ts
│   ├── nickname
│   │   ├── api.ts
│   │   ├── index.ts
│   │   ├── request.ts
│   │   └── response.ts
│   ├── types
│   │   └── common.ts
│   ├── user
│   │   ├── api.ts
│   │   ├── index.ts
│   │   ├── request.ts
│   │   └── response.ts
│   └── webrtc
│       ├── api.ts
│       ├── index.ts
│       ├── request.ts
│       └── response.ts
│
├── assets
│   ├── comics
│   │   └── image.png
│   ├── icons
│   │   └── ArrowLeft.svg
│   │        .
│   │        .
│   └── images
│        ├── AI.png
│        │   .
│        │   .
│        └── Slides
│             └── slide1.png
│                 .
│                 .
│
├── components
│   ├── BabyAvatar.tsx
│   ├── ChatPanel.tsx
│   ├── DictionaryPageCard.tsx
│   ├── Logo.tsx
│   ├── MainEventCalendar.tsx
│   ├── PhotoBookModal.tsx
│   ├── PromiseStore.tsx
│   ├── RightIcons.tsx
│   ├── Sidebar.tsx
│   │
│   ├── animations
│   │   ├── Loading.tsx
│   │   ├── Carousel
│   │   │   ├── Carousel.css
│   │   │   └── Carousel.tsx
│   │   ├── CurvedLoop
│   │   │   ├── CurvedLoop.css
│   │   │   └── CurvedLoop.tsx
│   │   ├── Dock
│   │   │   ├── Dock.css
│   │   │   └── Dock.tsx
│   │   ├── Lanyard
│   │   │   ├── card.glb
│   │   │   ├── Lanyard.css
│   │   │   ├── lanyard.png
│   │   │   └── Lanyard.tsx
│   │   ├── Masonry
│   │   ├── ScrollFloat
│   │   │   ├── ScrollFloat.css
│   │   │   └── ScrollFloat.tsx
│   │   └── SplitText
│   │       └── SplitText.tsx
│   │
│   ├── auth
│   │   ├── AuthBackground.tsx
│   │   ├── AuthForm.tsx
│   │   ├── FormTitle.tsx
│   │   ├── LoginForm.tsx
│   │   ├── Particles.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── SignUpForm.tsx
│   │
│   ├── calendar
│   │   ├── AddSchedule.tsx
│   │   ├── CalendarDetail.tsx
│   │   ├── EditSchedule.tsx
│   │   └── Schedule.tsx
│   │
│   ├── cartoon
│   │   └── Cartoon.tsx
│   │
│   ├── coupleConnection
│   │   ├── AdditionalInfoPage.tsx
│   │   ├── ConnectionBinder.tsx
│   │   ├── MyConnectionInfo.tsx
│   │   └── PartnerConnectionForm.tsx
│   │
│   ├── modal
│   │   └── Modal.tsx
│   │
│   ├── onboarding
│   │   ├── FixedButtons.tsx
│   │   ├── OnBoardingFooter.tsx
│   │   ├── OnBoardingGallery.tsx
│   │   └── OnBoardingInfo.tsx
│   │
│   └─webrtc
│       ├── AudioComponent.tsx
│       └── VideoComponent.tsx
│
├── pages
│   ├── AuthPage.tsx
│   ├── CalendarPage.tsx
│   ├── CartoonPage.tsx
│   ├── CartoonResultPage.tsx
│   ├── CoupleConnectionPage.tsx
│   ├── DictionaryPage.tsx
│   ├── GalleryPage.tsx
│   ├── LetterPage.tsx
│   ├── MainPage.tsx
│   ├── MyPage.tsx
│   ├── OnBoardingPage.tsx
│   ├── TalkRoomPage.tsx
│   └── WebRtcPage.tsx
│
├── styles
│   └── AdditionalInfo.css
│       .
│       .
│
├── types
│   └── meshline.d.ts
│   └── stompjs.d.ts
│   └── svg.d.ts
│
└── utils
    └── token.ts
```

### 백엔드 프로젝트 구조

```
src/main/java/com/aicontact/backend
├── AicontactBeApplication.java
│
├── aiChild
│   ├── controller
│   │   └── AiChildController.java
│   ├── dto
│   │   ├── AiChildImage.java
│   │   ├── request
│   │   │   ├── CreateAiChildRequest.java
│   │   │   └── UpdateAiChildRequest.java
│   │   └── response
│   │       └── AiChildResponse.java
│   ├── entity
│   │   └── AiChildEntity.java
│   ├── repository
│   │   └── AiChildRepository.java
│   └── service
│       ├── AiChildImagenService.java
│       ├── AiChildService.java
│       └── DailyExperienceScheduler.java
│
├── auth
│   ├── dto
│   │   ├── CustomUserDetails.java
│   │   └── LoginRequest.java
│   ├── jwt
│   │   ├── JwtFilter.java
│   │   ├── JwtUtil.java
│   │   └── LoginFilter.java
│   └── service
│       └── CustomUserDetailsService.java
│
├── babychat
│   ├── config
│   │   ├── GmsProperties.java
│   │   └── WebClientConfig.java
│   ├── controller
│   │   ├── BabyChatRestController.java
│   │   └── MessageSummaryController.java
│   ├── dto
│   │   ├── request
│   │   │   └── ChatRequestDTO.java
│   │   └── response
│   │       ├── BabyLetterResponse.java
│   │       └── ChatResponseDTO.java
│   ├── entity
│   │   ├── AiMessageType.java
│   │   ├── BabyChatMessage.java
│   │   └── BabyLetter.java
│   ├── repository
│   │   ├── BabyChatMessageRepository.java
│   │   └── BabyLetterRepository.java
│   └── service
│       └── GmsChatService.java
│
├── chat
│   ├── controller
│   │   └── ChatController.java
│   ├── dto
│   │   └── ChatDto.java
│   ├── entity
│   │   └── Chat.java
│   ├── repository
│   │   └── ChatRepository.java
│   └── service
│       └── ChatService.java
│
├── comicStrips
│   ├── controller
│   │   └── ComicStripsController.java
│   ├── dto
│   │   ├── ComicStripsImage.java
│   │   ├── request
│   │   │   ├── CreateComicStripsRequest.java
│   │   │   └── UpdateComicStripsTitleRequest.java
│   │   └── response
│   │       ├── ComicStripsListResponse.java
│   │       └── ComicStripsResponse.java
│   ├── entity
│   │   └── ComicStripsEntity.java
│   ├── repository
│   │   └── ComicStripsRepository.java
│   └── service
│       ├── ComicStripsImagenService.java
│       └── ComicStripsService.java
│
├── couple
│   ├── controller
│   │   └── CoupleController.java
│   ├── dto
│   │   ├── request
│   │   │   ├── CoupleMatchingRequest.java
│   │   │   ├── CoupleUpdateRequest.java
│   │   │   └── VerificationCodeRequest.java
│   │   └── response
│   │       ├── CoupleInfoResponse.java
│   │       ├── CoupleResponse.java
│   │       ├── MatchResponse.java
│   │       ├── PartnerResponse.java
│   │       └── VerificationCodeResponse.java
│   ├── entity
│   │   └── CoupleEntity.java
│   ├── repository
│   │   └── CoupleRepository.java
│   └── service
│       └── CoupleService.java
│
├── dailySchedule
│   ├── controller
│   │   └── DailyScheduleController.java
│   ├── dto
│   │   ├── DailyScheduleRequestDto.java
│   │   ├── DailyScheduleResponseDto.java
│   │   ├── DailyScheduleSummaryDto.java
│   │   └── DailyScheduleUpdateDto.java
│   ├── entity
│   │   └── DailyScheduleEntity.java
│   ├── repository
│   │   └── DailyScheduleRepository.java
│   └── service
│       └── DailyScheduleService.java
│
├── global
│   ├── config
│   │   ├── S3Config.java
│   │   ├── SecurityConfig.java
│   │   ├── WebConfig.java
│   │   └── WebSocketConfig.java
│   ├── controller
│   │   └── MediaController.java
│   ├── dto
│   │   ├── MediaFileDto.java
│   │   ├── MediaSearchCondition.java
│   │   ├── MediaThumbnailDto.java
│   │   ├── PaginationInfo.java
│   │   └── response
│   │       ├── ApiResponse.java
│   │       ├── DeleteMediaResponse.java
│   │       ├── FavoriteResponse.java
│   │       ├── MediaListResponse.java
│   │       └── MediaThumbnailListResponse.java
│   ├── entity
│   │   ├── BaseCreatedEntity.java
│   │   ├── BaseTimeEntity.java
│   │   ├── MediaFileEntity.java
│   │   └── enumeration
│   │       ├── CallStatus.java
│   │       ├── CallType.java
│   │       ├── ChatMessageType.java
│   │       ├── CoupleStatus.java
│   │       ├── FileType.java
│   │       ├── MatchingCodeStatus.java
│   │       └── MessageType.java
│   ├── exception
│   │   ├── ErrorResponse.java
│   │   └── GlobalExceptionHandler.java
│   ├── repository
│   │   └── MediaFileRepository.java
│   ├── service
│   │   ├── GptScenarioService.java
│   │   └── MediaFileService.java
│   └── storage
│       ├── S3StorageService.java
│       ├── StorageService.java
│       └── ThumbnailService.java
│
├── nickname
│   ├── controller
│   │   └── NicknameController.java
│   ├── dto
│   │   ├── NicknameRequestDto.java
│   │   └── NicknameResponseDto.java
│   ├── entity
│   │   └── NicknameEntity.java
│   ├── repository
│   │   └── NicknameRepository.java
│   └── service
│       └── NicknameService.java
│
├─user
│   ├── controller
│   │   └── UserController.java
│   ├── dto
│   │   ├── JoinDto.java
│   │   ├── UpdateUserDto.java
│   │   ├── UpdateUserPasswordRequestDto.java
│   │   ├── UserDto.java
│   │   └── UserResponseDto.java
│   ├── entity
│   │   └── UserEntity.java
│   ├── repository
│   │   └── UserRepository.java
│   └── service
│       └── UserService.java
│
└── webrtc
    ├── controller
    │   └── WebRtcController.java
    └── service
```

## REST API 명세서

[ AI CONTACT REST API 명세서 - Notion 링크](https://www.notion.so/API-2349420b831180e7a74bc0dc21719e12)

## 개발자

|                      **노다빈**                       |                       **이희준**                        |              **이성준**              |                     **김민선**                      |                       **김소연**                        |                              **진성범**                               |
| :---------------------------------------------------: | :-----------------------------------------------------: | :----------------------------------: | :-------------------------------------------------: | :-----------------------------------------------------: | :-------------------------------------------------------------------: |
|                    BE │ FE │ UI/UX                    |                       INFRA │ BE                        |                  FE                  |                       FE │ UI                       |                           BE                            |                                  BE                                   |
| Gen AI-네컷만화</br>WebRTC 화상 통화</br>UI 구조 설계 | CI/CD 구축</br>S3, RDS 인프라 구축</br>Gen AI-아이 생성 | 커플 매칭</br>공유 캘린더</br>온보딩 | 애칭 백과사전</br>공유 갤러리</br>편지 생성 및 확인 | Gen AI-고민상담</br>Gen AI-채팅 요약</br>WebSocket 채팅 | Auth 로그인/회원가입</br>프로젝트 소개 영상 제작</br>PPT 제작 및 발표 |
