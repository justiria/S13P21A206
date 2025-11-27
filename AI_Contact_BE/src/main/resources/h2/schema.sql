-- H2 전용 스키마

-- 1. users
CREATE TABLE users (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  email          VARCHAR(255)    NOT NULL UNIQUE,
  password       VARCHAR(255)    NOT NULL,
  name           VARCHAR(100)    NOT NULL,
  birth_date     DATE,
  couple_status  VARCHAR(10)     DEFAULT 'SINGLE',
  created_at     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- 2. matching_codes
CREATE TABLE matching_codes (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id          BIGINT            NOT NULL,
  code             VARCHAR(6)        NOT NULL,
  expires_at       TIMESTAMP         NOT NULL,
  status           VARCHAR(10)       DEFAULT 'ACTIVE',
  matched_user_id  BIGINT,
  created_at       TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)         REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (matched_user_id) REFERENCES users(id)    ON DELETE SET NULL
);

-- 3. couples
CREATE TABLE couples (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  user1_id     BIGINT            NOT NULL,
  user2_id     BIGINT            NOT NULL,
  start_date   DATE,
  couple_name  VARCHAR(100),
  created_at   TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user1_id, user2_id)
);

-- 4. ai_children
CREATE TABLE ai_children (
  id                BIGINT AUTO_INCREMENT PRIMARY KEY,
  couple_id         BIGINT            NOT NULL,
  name              VARCHAR(50)       NOT NULL,
  growth_level      INT               DEFAULT 1,
  experience_points INT               DEFAULT 0,
  created_at        TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (couple_id) REFERENCES couples(id) ON DELETE CASCADE
);

-- 5. ai_conversations
CREATE TABLE ai_conversations (
  id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id                 BIGINT            NOT NULL,
  ai_children_id          BIGINT            NOT NULL,
  message_type            VARCHAR(10)       NOT NULL,
  content                 TEXT              NOT NULL,
  conversation_session_id VARCHAR(36),
  created_at              TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)        REFERENCES users(id)       ON DELETE CASCADE,
  FOREIGN KEY (ai_children_id) REFERENCES ai_children(id) ON DELETE CASCADE
);

-- 6. baby_letters
CREATE TABLE baby_letters (
  id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
  couple_id               BIGINT            NOT NULL,
  sender_user_id          BIGINT            NOT NULL,
  ai_children_id          BIGINT            NOT NULL,
  letter_content          TEXT              NOT NULL,
  conversation_session_id VARCHAR(36),
  created_at              TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (couple_id)      REFERENCES couples(id)    ON DELETE CASCADE,
  FOREIGN KEY (sender_user_id) REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (ai_children_id) REFERENCES ai_children(id) ON DELETE CASCADE
);

-- 7. chat_rooms
CREATE TABLE chat_rooms (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  couple_id    BIGINT            NOT NULL,
  created_at   TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (couple_id) REFERENCES couples(id) ON DELETE CASCADE
);

-- 8. chat_messages
CREATE TABLE chat_messages (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  room_id      BIGINT            NOT NULL,
  sender_id    BIGINT            NOT NULL,
  content      TEXT              NOT NULL,
  message_type VARCHAR(10)       DEFAULT 'text',
  sent_at      TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id)   REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id)      ON DELETE CASCADE
);

-- 9. video_calls
CREATE TABLE video_calls (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  couple_id        BIGINT            NOT NULL,
  initiator_id     BIGINT            NOT NULL,
  call_type        VARCHAR(10)       NOT NULL,
  start_time       TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  end_time         TIMESTAMP,
  call_status      VARCHAR(10)       DEFAULT 'initiated',
  duration_seconds INT               DEFAULT 0,
  created_at       TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (couple_id)    REFERENCES couples(id)     ON DELETE CASCADE,
  FOREIGN KEY (initiator_id) REFERENCES users(id)       ON DELETE CASCADE
);

-- 10. media_files
CREATE TABLE media_files (
  id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
  couple_id          BIGINT            NOT NULL,
  uploader_id        BIGINT            NOT NULL,
  file_url           VARCHAR(500)      NOT NULL,
  file_type          VARCHAR(10)       NOT NULL,
  file_size          BIGINT,
  original_filename  VARCHAR(255),
  s3_key             VARCHAR(500),
  thumbnail_url      VARCHAR(500),
  is_favorite        BOOLEAN           DEFAULT FALSE,
  upload_date        DATE              NOT NULL,
  created_at         TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (couple_id)   REFERENCES couples(id)  ON DELETE CASCADE,
  FOREIGN KEY (uploader_id) REFERENCES users(id)     ON DELETE CASCADE
);

-- 11. comic_strips
CREATE TABLE comic_strips (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  couple_id       BIGINT            NOT NULL,
  creator_id      BIGINT            NOT NULL,
  comic_image_url VARCHAR(500)      NOT NULL,
  s3_key          VARCHAR(500)      NOT NULL,
  title           VARCHAR(100),
  created_at      TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (couple_id)  REFERENCES couples(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_id) REFERENCES users(id)    ON DELETE CASCADE
);

-- 12. nicknames
CREATE TABLE nicknames (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  couple_id  BIGINT            NOT NULL,
  creator_id BIGINT            NOT NULL,
  nickname   VARCHAR(50)       NOT NULL,
  description TEXT,
  created_at  TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (couple_id)  REFERENCES couples(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_id) REFERENCES users(id)    ON DELETE CASCADE,
  UNIQUE (couple_id, nickname)
);

-- 13. daily_schedules
CREATE TABLE daily_schedules (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  couple_id      BIGINT            NOT NULL,
  creator_id     BIGINT            NOT NULL,
  schedule_date  DATE              NOT NULL,
  title          VARCHAR(100)      NOT NULL,
  memo           TEXT,
  created_at     TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (couple_id)  REFERENCES couples(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_id) REFERENCES users(id)    ON DELETE CASCADE
);