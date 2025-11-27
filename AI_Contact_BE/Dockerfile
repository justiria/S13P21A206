# ─── Stage 1: Build ───────────────────────────────────────────
FROM gradle:jdk21 AS builder
WORKDIR /app

# 1) 캐시를 위해 빌드스크립트 먼저 복사
COPY settings.gradle build.gradle gradlew ./
COPY gradle gradle/
RUN chmod +x gradlew

# 2) 의존성만 미리 다운로드
RUN ./gradlew dependencies --no-daemon --quiet

# 3) 소스 복사 후 실제 빌드 (테스트 제외)
COPY . .
RUN chmod +x gradlew \
 && ./gradlew bootJar -x test --no-daemon --quiet

# ─── Stage 2: Runtime ─────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Spring Boot fat JAR 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# (선택) 컨테이너 포트 문서화
EXPOSE 8081

ENTRYPOINT ["java","-jar","/app/app.jar"]