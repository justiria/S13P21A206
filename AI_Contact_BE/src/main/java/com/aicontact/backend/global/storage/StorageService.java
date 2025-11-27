package com.aicontact.backend.global.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface StorageService {

    public String upload(MultipartFile file, String key) throws IOException;

    /**
     * 범용 업로드: 바이트 배열 + MIME 타입
     */
    public String upload(byte[] data, String key, String contentType);
    /**
     * S3 객체 삭제
     */
    public void delete(String key);
}
