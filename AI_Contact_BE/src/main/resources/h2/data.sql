-- H2용 더미 데이터 삽입

-- 1) users
INSERT INTO users (id, email, password, name, birth_date, couple_status) VALUES
  (1, 'alice@example.com', 'alicepwd', 'Alice', DATE '1992-05-10', 'COUPLED'),
  (2, 'bob@example.com',   'bobpwd',   'Bob',   DATE '1991-08-20', 'COUPLED');

-- 2) matching_codes
INSERT INTO matching_codes (id, user_id, code, expires_at, status) VALUES
  (1, 1, 'ABC123', TIMESTAMP '2025-07-31 23:59:59', 'ACTIVE');

-- 3) couples
INSERT INTO couples (id, user1_id, user2_id, start_date, couple_name) VALUES
  (1, 1, 2, DATE '2023-09-01', 'Alice♥Bob');

-- 4) ai_children
INSERT INTO ai_children (id, couple_id, name, growth_level, experience_points) VALUES
  (1, 1, 'TinyBob', 1, 0);

-- 5) ai_conversations
INSERT INTO ai_conversations (id, user_id, ai_children_id, message_type, content, conversation_session_id) VALUES
  (1, 1, 1, 'user', 'Hi there',      'sess-1234'),
  (2, 2, 1, 'ai',   'Hello, I am your AI child.', 'sess-1234');

-- 6) baby_letters
INSERT INTO baby_letters (id, couple_id, sender_user_id, ai_children_id, letter_content, conversation_session_id) VALUES
  (1, 1, 1, 1, 'Dear parents, today I learned about love.', 'sess-1234');

-- 7) chat_rooms
INSERT INTO chat_rooms (id, couple_id) VALUES
  (1, 1);

-- 8) chat_messages
INSERT INTO chat_messages (id, room_id, sender_id, content, message_type) VALUES
  (1, 1, 1, 'Hello Bob', 'text'),
  (2, 1, 2, 'Hi Alice',  'text');

-- 9) video_calls
INSERT INTO video_calls (id, couple_id, initiator_id, call_type, start_time, end_time, call_status, duration_seconds) VALUES
  (1, 1, 1, 'video', TIMESTAMP '2025-07-22 12:00:00', TIMESTAMP '2025-07-22 12:30:00', 'ended', 1800);

-- 10) media_files
INSERT INTO media_files (
    id, couple_id, uploader_id,
    file_url, file_type, file_size,
    original_filename, s3_key, thumbnail_url,
    is_favorite, upload_date
) VALUES
  (1, 1, 1,
   'https://s3.example.com/media/photo1.jpg', 'image', 204800,
   'photo1.jpg', 'media/photo1.jpg', 'media/thumb_photo1.jpg',
   TRUE, DATE '2025-07-22'
  );

-- 11) comic_strips
INSERT INTO comic_strips (id, couple_id, creator_id, comic_image_url, s3_key, title) VALUES
  (1, 1, 1,
   'https://s3.example.com/comics/comic1.png', 'comic/comic1.png', 'First Strip'
  );

-- 12) nicknames
INSERT INTO nicknames (id, couple_id, creator_id, nickname, description) VALUES
  (1, 1, 1, '내 사랑', '로맨틱한 순간에 부르는 애칭');

-- 13) daily_schedules
INSERT INTO daily_schedules (id, couple_id, creator_id, schedule_date, title, memo) VALUES
  (1, 1, 1, DATE '2025-07-22', 'Movie Night', 'Watch a romantic movie together.');